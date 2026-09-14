"use client";

import { forwardRef } from "react";
import type { ArchNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NODE_KINDS } from "./nodeKinds";

interface Props {
  node: ArchNode;
  selected: boolean;
  /** Node is connected to the active node (or is the active node). */
  related: boolean;
  /** Some node is active and this one is unrelated → dim. */
  dimmed: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onKeyNav: (dir: 1 | -1) => void;
  detailId: string;
}

export const ArchitectureNode = forwardRef<HTMLButtonElement, Props>(function ArchitectureNode(
  { node, selected, related, dimmed, onSelect, onHover, onKeyNav, detailId },
  ref,
) {
  const kind = NODE_KINDS[node.kind];
  const Icon = kind.icon;
  return (
    <button
      ref={ref}
      type="button"
      data-node-id={node.id}
      aria-pressed={selected}
      aria-describedby={selected ? detailId : undefined}
      aria-label={`${node.label}${node.sublabel ? `, ${node.sublabel}` : ""} (${kind.label})`}
      onClick={() => onSelect(node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); onKeyNav(1); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); onKeyNav(-1); }
      }}
      className={cn(
        "group relative z-10 flex min-w-[150px] max-w-[220px] flex-1 basis-[150px] flex-col items-start gap-1.5 rounded-xl border bg-surface px-3.5 py-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200",
        "hover:-translate-y-px hover:border-border-strong hover:shadow-card",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        selected ? "border-accent ring-1 ring-accent" : related ? "border-accent/60" : "border-border",
        dimmed && "opacity-50",
      )}
    >
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
        <Icon className={cn("h-3.5 w-3.5", (selected || related) && "text-accent")} aria-hidden />
        {kind.label}
      </span>
      <span className="text-[13.5px] font-semibold leading-tight text-fg">{node.label}</span>
      {node.sublabel && <span className="text-xs leading-snug text-muted">{node.sublabel}</span>}
      {node.tech.length > 0 && (
        <span className="mt-0.5 flex flex-wrap gap-1">
          {node.tech.slice(0, 3).map((t) => (
            <span key={t} className="rounded bg-surface-2 px-1.5 py-px font-mono text-[10px] text-fg-2">
              {t}
            </span>
          ))}
        </span>
      )}
      {selected && (
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-bg" aria-hidden />
      )}
    </button>
  );
});
