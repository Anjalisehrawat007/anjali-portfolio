"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Architecture } from "@/lib/types";
import { useFlowEdges, useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ArchitectureNode } from "./ArchitectureNode";
import { FlowEdges } from "./FlowEdges";
import { NodeDetail } from "./NodeDetail";

interface Props {
  architecture: Architecture;
  /** Name used in aria-label. */
  title: string;
  className?: string;
  /** Pre-select a node (e.g. from a case-study anchor). */
  initialSelected?: string | null;
}

/**
 * Interactive, data-driven system diagram.
 * Layered layout: one row per stage, nodes side by side; edges are computed
 * from real DOM geometry so the diagram is fully responsive.
 */
export function ArchitectureDiagram({ architecture, title, className, initialSelected = null }: Props) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const [hovered, setHovered] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const detailId = useId();

  const edges = useMemo(() => architecture.edges.map(({ from, to }) => ({ from, to })), [architecture.edges]);
  const { geometry, size } = useFlowEdges(containerRef, nodeRefs, edges);

  const activeId = selected ?? hovered;
  const relatedIds = useMemo(() => {
    if (!activeId) return new Set<string>();
    const s = new Set<string>([activeId]);
    for (const e of architecture.edges) {
      if (e.from === activeId) s.add(e.to);
      if (e.to === activeId) s.add(e.from);
    }
    return s;
  }, [activeId, architecture.edges]);

  const order = useMemo(() => architecture.nodes.map((n) => n.id), [architecture.nodes]);
  const selectedNode = architecture.nodes.find((n) => n.id === selected) ?? null;

  const stages = useMemo(
    () => architecture.stages.map((label, i) => ({ label, nodes: architecture.nodes.filter((n) => n.stage === i) })),
    [architecture],
  );

  const navigate = useCallback(
    (dir: 1 | -1) => {
      const cur = selected ?? hovered ?? order[0];
      const idx = Math.max(0, order.indexOf(cur));
      const next = order[(idx + dir + order.length) % order.length];
      setSelected(next);
      nodeRefs.current.get(next)?.focus();
    },
    [selected, hovered, order],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selected) setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const animate = playing && !reduced;

  return (
    <div className={cn("grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start", className)}>
      <div className="canvas relative overflow-hidden rounded-2xl p-4 sm:p-6">
        <div className="bg-spot pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className="hidden whitespace-nowrap xl:inline">System diagram</span>
            <span className="whitespace-nowrap rounded-md border border-border bg-surface px-1.5 py-0.5 text-fg-2">{architecture.nodes.length} components</span>
            <span className="whitespace-nowrap rounded-md border border-border bg-surface px-1.5 py-0.5 text-fg-2">{architecture.edges.length} flows</span>
          </div>
          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              disabled={reduced}
              aria-pressed={playing}
              title={reduced ? "Animation disabled by reduced-motion preference" : playing ? "Pause data flow" : "Play data flow"}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-fg-2 transition-colors hover:text-fg disabled:opacity-50"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">Data flow</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelected(null); setHovered(null); }}
              title="Reset selection"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-fg-2 transition-colors hover:text-fg"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          role="group"
          aria-label={`${title} architecture: ${architecture.summary}`}
          className="relative"
        >
          <div className="pointer-events-none absolute bottom-0 left-[39px] top-0 hidden w-px bg-gradient-to-b from-transparent via-border-strong to-transparent sm:block" aria-hidden />
          <FlowEdges geometry={geometry} edges={architecture.edges} size={size} activeId={activeId} animate={animate} />
          <ol className="relative z-10 flex flex-col gap-12 sm:gap-14">
            {stages.map((stage, i) => (
              <li key={stage.label} className="relative sm:pl-24">
                <div className="mb-2 flex items-center gap-2 sm:absolute sm:left-0 sm:top-1/2 sm:mb-0 sm:w-20 sm:-translate-y-1/2 sm:flex-col sm:items-end sm:gap-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/80">0{i + 1}</span>
                  <span className="text-[11px] font-medium text-fg-2 sm:text-right">{stage.label}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {stage.nodes.map((node) => (
                    <ArchitectureNode
                      key={node.id}
                      ref={(el) => {
                        if (el) nodeRefs.current.set(node.id, el);
                        else nodeRefs.current.delete(node.id);
                      }}
                      node={node}
                      selected={selected === node.id}
                      related={relatedIds.has(node.id)}
                      dimmed={activeId !== null && !relatedIds.has(node.id)}
                      onSelect={(id) => setSelected((s) => (s === id ? null : id))}
                      onHover={setHovered}
                      onKeyNav={navigate}
                      detailId={detailId}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Detail panel — sticky sidebar on desktop; bottom sheet on smaller screens when a node is selected */}
      {!isDesktop && selected && (
        <button
          type="button"
          aria-label="Close details"
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        />
      )}
      <div
        className={cn(
          "lg:sticky lg:top-24",
          !isDesktop && selected && "fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto px-3 pb-3 [&>div>div]:shadow-2xl",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected ?? "__summary"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <NodeDetail
              id={detailId}
              architecture={architecture}
              node={selectedNode}
              onClose={() => setSelected(null)}
              onNavigate={navigate}
              onSelect={(id) => { setSelected(id); nodeRefs.current.get(id)?.focus(); }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
