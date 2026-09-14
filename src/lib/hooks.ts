"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const noopSubscribe = () => () => {};
/** False during SSR/hydration, true after mount — without a setState-in-effect. */
export function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** 0..1 document scroll progress, throttled to animation frames. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

/** True once the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/**
 * Tracks which of the given section ids is most visible in the viewport.
 * Uses IntersectionObserver with a band near the top of the viewport so the
 * active item flips as the section header crosses the nav.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        if (visible.size) {
          // Prefer the earliest section in document order among the visible ones.
          const first = ids.find((id) => visible.has(id));
          if (first) setActive(first);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export interface EdgeGeometry {
  id: string;
  d: string;
  from: string;
  to: string;
  /** Midpoint for labels. */
  mid: { x: number; y: number };
}

/**
 * Computes SVG paths between DOM nodes inside a container.
 * Works for vertical and horizontal flows: the anchor sides are chosen from the
 * relative position of the two nodes, so the same hook powers the hero graph
 * (horizontal on desktop, vertical on mobile) and the architecture diagrams.
 */
export function useFlowEdges(
  containerRef: RefObject<HTMLElement | null>,
  nodeRefs: RefObject<Map<string, HTMLElement>>,
  edges: { from: string; to: string }[],
) {
  const [geometry, setGeometry] = useState<EdgeGeometry[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const rafRef = useRef(0);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const cRect = container.getBoundingClientRect();
      const next: EdgeGeometry[] = [];
      for (const e of edges) {
        const a = nodeRefs.current?.get(e.from);
        const b = nodeRefs.current?.get(e.to);
        if (!a || !b) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const ax = ra.left - cRect.left, ay = ra.top - cRect.top;
        const bx = rb.left - cRect.left, by = rb.top - cRect.top;
        const acx = ax + ra.width / 2, acy = ay + ra.height / 2;
        const bcx = bx + rb.width / 2, bcy = by + rb.height / 2;
        const horizontal = Math.abs(bcx - acx) > Math.abs(bcy - acy);
        let x1: number, y1: number, x2: number, y2: number, d: string;
        if (horizontal) {
          const forward = bcx >= acx;
          x1 = forward ? ax + ra.width : ax; y1 = acy;
          x2 = forward ? bx : bx + rb.width; y2 = bcy;
          const dx = (x2 - x1) / 2;
          d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        } else {
          const forward = bcy >= acy;
          x1 = acx; y1 = forward ? ay + ra.height : ay;
          x2 = bcx; y2 = forward ? by : by + rb.height;
          const dy = (y2 - y1) / 2;
          d = `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
        }
        next.push({ id: `${e.from}->${e.to}`, from: e.from, to: e.to, d, mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 } });
      }
      setGeometry(next);
      setSize({ width: container.clientWidth, height: container.clientHeight });
    };

    const schedule = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(container);
    nodeRefs.current?.forEach((el) => ro.observe(el));
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [containerRef, nodeRefs, edges]);

  return { geometry, size };
}
