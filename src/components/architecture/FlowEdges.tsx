"use client";

import { useId } from "react";
import type { EdgeGeometry } from "@/lib/hooks";
import type { ArchEdge } from "@/lib/types";

interface Props {
  geometry: EdgeGeometry[];
  edges: ArchEdge[];
  size: { width: number; height: number };
  activeId: string | null;
  animate: boolean;
  showLabels?: boolean;
}

/** SVG overlay drawing bezier edges + glowing packets between DOM nodes. */
export function FlowEdges({ geometry, edges, size, activeId, animate, showLabels = true }: Props) {
  const uid = useId().replace(/:/g, "");
  if (!size.width) return null;
  const meta = new Map(edges.map((e) => [`${e.from}->${e.to}`, e]));
  const gradId = `edge-grad-${uid}`;
  const glowId = `edge-glow-${uid}`;
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id={`arrow-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-strong)" />
        </marker>
        <marker id={`arrow-active-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>
      {geometry.map((g, i) => {
        const e = meta.get(g.id);
        const active = activeId !== null && (g.from === activeId || g.to === activeId);
        const dimmed = activeId !== null && !active;
        return (
          <g key={g.id} style={{ opacity: dimmed ? 0.3 : 1, transition: "opacity 240ms" }}>
            {active && <path d={g.d} fill="none" stroke="var(--accent)" strokeWidth={6} opacity={0.12} />}
            <path
              d={g.d}
              fill="none"
              stroke={active ? `url(#${gradId})` : "var(--border-strong)"}
              strokeWidth={active ? 1.75 : 1.25}
              strokeDasharray={e?.dashed ? "4 4" : undefined}
              markerEnd={`url(#${active ? `arrow-active-${uid}` : `arrow-${uid}`})`}
              style={{ transition: "stroke 240ms" }}
            />
            {animate && !e?.dashed && (
              <circle r={active ? 3 : 2.4} fill={active ? "var(--accent-2)" : "var(--muted)"} opacity={active ? 1 : 0.65} filter={active ? `url(#${glowId})` : undefined}>
                <animateMotion dur="2.8s" repeatCount="indefinite" path={g.d} begin={`${(i * 0.4) % 2.8}s`} calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
              </circle>
            )}
            {showLabels && e?.label && (
              <g transform={`translate(${g.mid.x}, ${g.mid.y})`}>
                <rect x={-e.label.length * 3.1 - 6} y={-9} width={e.label.length * 6.2 + 12} height={18} rx={5} fill="var(--surface)" stroke="var(--border)" />
                <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fontFamily="var(--font-mono)" fill={active ? "var(--accent)" : "var(--muted)"}>
                  {e.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
