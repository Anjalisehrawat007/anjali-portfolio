"use client";

import { useMemo, useRef, useState } from "react";
import { BrainCircuit, Cpu, FileInput, Layers, Target } from "lucide-react";
import { useFlowEdges, usePrefersReducedMotion } from "@/lib/hooks";
import { FlowEdges } from "@/components/architecture/FlowEdges";
import { cn } from "@/lib/utils";

/**
 * Input → Intelligence → Processing → System → Output.
 * Each stage lists real technologies / signals from the resume projects.
 * Reacts subtly to the cursor (parallax); static under reduced motion.
 */
const STAGES = [
  { id: "input", label: "Input", icon: FileInput, items: ["Symptoms", "Medical scans", "Sensor streams", "Movement"] },
  { id: "intelligence", label: "Intelligence", icon: BrainCircuit, items: ["BioBERT", "CNN", "LSTM", "MediaPipe"] },
  { id: "processing", label: "Processing", icon: Cpu, items: ["FastAPI", "Flask", "Next.js"] },
  { id: "system", label: "System", icon: Layers, items: ["Ethereum", "IPFS", "Docker", "AWS/GCP"] },
  { id: "output", label: "Output", icon: Target, items: ["Screening", "Predictions", "Analytics", "Credentials"] },
] as const;

const EDGES = STAGES.slice(0, -1).map((s, i) => ({ from: s.id, to: STAGES[i + 1].id }));

export function HeroVisual({ className, pointer }: { className?: string; pointer: { x: number; y: number } | null }) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [hovered, setHovered] = useState<string | null>(null);
  const edges = useMemo(() => EDGES, []);
  const { geometry, size } = useFlowEdges(containerRef, nodeRefs, edges);

  return (
    <div className={cn("relative select-none", className)}>
      <div ref={containerRef} className="relative" role="img" aria-label="System pipeline: input, intelligence, processing, system, output">
        <FlowEdges geometry={geometry} edges={edges} size={size} activeId={hovered} animate={!reduced} showLabels={false} />
        <ul className="relative z-10 flex flex-col items-stretch gap-8 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const depth = (i - 2) * 0.4;
            const dx = pointer && !reduced ? pointer.x * 6 * depth : 0;
            const dy = pointer && !reduced ? pointer.y * 6 * depth : 0;
            const active = hovered === s.id;
            const dim = hovered !== null && !active;
            return (
              <li
                key={s.id}
                ref={(el) => { if (el) nodeRefs.current.set(s.id, el); else nodeRefs.current.delete(s.id); }}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ transform: `translate(${dx}px, ${dy}px)`, transition: "transform 240ms cubic-bezier(0.22,1,0.36,1), opacity 200ms" }}
                className={cn(
                  "card group flex w-full min-w-0 flex-col gap-2.5 rounded-xl p-4 sm:basis-0 sm:flex-1",
                  active && "card-active",
                  dim && "opacity-60",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("grid h-8 w-8 place-items-center rounded-lg transition-colors", active ? "bg-accent text-accent-fg shadow-[0_6px_16px_-8px_var(--accent)]" : "bg-surface-2 text-fg-2")}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">0{i + 1}</span>
                </div>
                <div className="text-[13.5px] font-semibold tracking-tight text-fg">{s.label}</div>
                <ul className="space-y-0.5">
                  {s.items.map((it) => (
                    <li key={it} className={cn("text-[11.5px] leading-snug transition-colors", active ? "text-fg-2" : "text-muted")}>{it}</li>
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
