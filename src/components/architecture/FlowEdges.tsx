"use client";

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

/** SVG overlay drawing bezier edges + animated packets between DOM nodes. */
export function FlowEdges({ geometry, edges, size, activeId, animate, showLabels = true }: Props) {
  if (!size.width) return null;
  const meta = new Map(edges.map((e) => [`${e.from}->${e.to}`, e]));
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden
    >
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-strong)" />
        </marker>
        <marker id="arch-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>
      {geometry.map((g, i) => {
        const e = meta.get(g.id);
        const active = activeId !== null && (g.from === activeId || g.to === activeId);
        const dimmed = activeId !== null && !active;
        return (
          <g key={g.id} style={{ opacity: dimmed ? 0.35 : 1, transition: "opacity 200ms" }}>
            <path
              d={g.d}
              fill="none"
              stroke={active ? "var(--accent)" : "var(--border-strong)"}
              strokeWidth={active ? 1.75 : 1.25}
              strokeDasharray={e?.dashed ? "4 4" : undefined}
              markerEnd={`url(#${active ? "arch-arrow-active" : "arch-arrow"})`}
              style={{ transition: "stroke 200ms" }}
            />
            {animate && !e?.dashed && (
              <circle r={2.5} fill={active ? "var(--accent)" : "var(--muted)"} opacity={active ? 1 : 0.7}>
                <animateMotion dur="2.4s" repeatCount="indefinite" path={g.d} begin={`${(i * 0.35) % 2.4}s`} />
              </circle>
            )}
            {showLabels && e?.label && (
              <g transform={`translate(${g.mid.x}, ${g.mid.y})`}>
                <rect x={-e.label.length * 3.1 - 5} y={-8} width={e.label.length * 6.2 + 10} height={16} rx={4} fill="var(--bg)" />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fill={active ? "var(--accent)" : "var(--muted)"}
                >
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
