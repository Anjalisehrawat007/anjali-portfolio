"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { BrainCircuit, Cpu, FileInput, Layers, Target } from "lucide-react";
import { useFlowEdges, usePrefersReducedMotion } from "@/lib/hooks";
import { FlowEdges } from "@/components/architecture/FlowEdges";
import { cn } from "@/lib/utils";

/**
 * Input → Intelligence → Processing → System → Output.
 * Each stage lists real technologies / signals from the resume projects.
 * Reacts subtly to the cursor (parallax + spotlight); static under reduced motion.
 */
const STAGES = [
  { id: "input", label: "Input", icon: FileInput, items: ["Symptoms", "Medical scans", "Sensor streams", "Movement"] },
  { id: "intelligence", label: "Intelligence", icon: BrainCircuit, items: ["BioBERT", "CNN", "LSTM", "MediaPipe"] },
  { id: "processing", label: "Processing", icon: Cpu, items: ["FastAPI", "Flask", "Next.js"] },
  { id: "system", label: "System", icon: Layers, items: ["Ethereum", "IPFS", "Docker", "AWS/GCP"] },
  { id: "output", label: "Output", icon: Target, items: ["Screening", "Predictions", "Analytics", "Credentials"] },
] as const;

const EDGES = STAGES.slice(0, -1).map((s, i) => ({ from: s.id, to: STAGES[i + 1].id }));

export function HeroVisual({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [hovered, setHovered] = useState<string | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const edges = useMemo(() => EDGES, []);
  const { geometry, size } = useFlowEdges(containerRef, nodeRefs, edges);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || !containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setPointer({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  return (
    <div
      className={cn("relative select-none", className)}
      onPointerMove={onMove}
      onPointerLeave={() => setPointer(null)}
    >
      {/* Spotlight that follows the cursor */}
      {pointer && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(240px circle at ${(pointer.x + 0.5) * 100}% ${(pointer.y + 0.5) * 100}%, var(--accent-soft), transparent 70%)`,
          }}
          aria-hidden
        />
      )}
      <div ref={containerRef} className="relative" role="img" aria-label="System pipeline: input, intelligence, processing, system, output">
        <FlowEdges geometry={geometry} edges={edges} size={size} activeId={hovered} animate={!reduced} showLabels={false} />
        <ul className="relative z-10 flex flex-col items-stretch gap-8 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const depth = (i - 2) * 0.4;
            const dx = pointer ? pointer.x * 6 * depth : 0;
            const dy = pointer ? pointer.y * 6 * depth : 0;
            const active = hovered === s.id;
            return (
              <li
                key={s.id}
                ref={(el) => { if (el) nodeRefs.current.set(s.id, el); else nodeRefs.current.delete(s.id); }}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ transform: `translate(${dx}px, ${dy}px)`, transition: "transform 200ms ease-out" }}
                className={cn(
                  "group flex w-full min-w-0 flex-col gap-2 rounded-xl border bg-surface p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors sm:basis-0 sm:flex-1",
                  active ? "border-accent" : "border-border hover:border-border-strong",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("grid h-7 w-7 place-items-center rounded-md transition-colors", active ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg-2")}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">0{i + 1}</span>
                </div>
                <div className="text-[13px] font-semibold text-fg">{s.label}</div>
                <ul className="space-y-0.5">
                  {s.items.map((it) => (
                    <li key={it} className={cn("text-[11px] leading-snug transition-colors", active ? "text-fg-2" : "text-muted")}>{it}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
