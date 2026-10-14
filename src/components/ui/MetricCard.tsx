"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import type { Metric } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Splits "15%" → { n: 15, decimals: 0, suffix: "%" }; non-numeric values render verbatim. */
function parseValue(v: string) {
  const m = v.match(/^([\d.,]+)(.*)$/);
  if (!m) return null;
  const num = m[1].replace(/,/g, "");
  return { n: parseFloat(num), decimals: (num.split(".")[1] ?? "").length, suffix: m[2] };
}

/** Counts a metric up when it enters the viewport (instant under reduced motion). */
function useCountUp(target: number | null, inView: boolean, reduced: boolean, duration = 900) {
  const [progress, setProgress] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (target === null || !inView || started.current || reduced) return;
    started.current = true;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, reduced, duration]);
  if (target === null) return null;
  if (reduced) return target; // no motion: show the final value immediately
  return target * progress;
}

export function MetricCard({ metric, size = "md", className }: { metric: Metric; size?: "sm" | "md" | "lg"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = usePrefersReducedMotion();
  const parsed = parseValue(metric.value);
  const n = useCountUp(parsed?.n ?? null, inView, reduced);
  // keep the value's own precision ("0.326" must not end as "0.3")
  const display = parsed && n !== null ? `${n.toFixed(parsed.decimals)}${parsed.suffix}` : metric.value;

  return (
    <div
      ref={ref}
      className={cn(
        "card card-hover spotlight group relative overflow-hidden rounded-2xl p-4",
        size === "lg" && "p-6 sm:p-7",
        className,
      )}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-opacity group-hover:opacity-100" aria-hidden />
      <div
        className={cn(
          "metric-number relative font-semibold",
          size === "sm" && "text-[1.75rem]",
          size === "md" && "text-4xl",
          size === "lg" && "text-6xl sm:text-7xl",
        )}
      >
        {display}
      </div>
      <div className={cn("relative mt-2 font-medium text-fg-2", size === "lg" ? "text-base" : "text-sm")}>{metric.label}</div>
      {metric.context && <div className="relative mt-0.5 text-xs text-muted">{metric.context}</div>}
      <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-border bg-surface-2/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted" title={metric.source === "resume" ? "Taken directly from the resume" : "Measured in the project's own evaluation (held-out test period)"}>
        <span className="h-1 w-1 rounded-full bg-success" aria-hidden />
        {metric.source}
      </div>
    </div>
  );
}
