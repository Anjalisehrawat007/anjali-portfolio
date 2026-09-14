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
        "card group relative z-10 flex min-w-[156px] max-w-[228px] flex-1 basis-[156px] flex-col items-start gap-1.5 rounded-xl px-3.5 py-3 text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        selected
          ? "card-active z-20 -translate-y-0.5"
          : related
            ? "border-accent/50 shadow-card"
            : "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card",
        dimmed && "opacity-45 saturate-50",
      )}
      style={{ transition: "transform 240ms cubic-bezier(0.22,1,0.36,1), opacity 240ms, box-shadow 240ms, border-color 200ms, filter 240ms" }}
    >
      <span className="flex w-full items-center justify-between">
        <span className={cn("inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors", selected || related ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted")}>
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {kind.label}
        </span>
        <span className="font-mono text-[9px] text-muted/70">{String(node.stage + 1).padStart(2, "0")}</span>
      </span>
      <span className="text-[13.5px] font-semibold leading-tight tracking-tight text-fg">{node.label}</span>
      {node.sublabel && <span className="text-xs leading-snug text-muted">{node.sublabel}</span>}
      {node.tech.length > 0 && (
        <span className="mt-1 flex flex-wrap gap-1">
          {node.tech.slice(0, 3).map((t) => (
            <span key={t} className={cn("rounded border px-1.5 py-px font-mono text-[10px] transition-colors", selected ? "border-accent/30 bg-accent-soft text-accent" : "border-border bg-surface-2 text-fg-2")}>
              {t}
            </span>
          ))}
        </span>
      )}
      {selected && (
        <span className="absolute -right-1.5 -top-1.5 flex h-3 w-3" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-accent ring-2 ring-bg" />
        </span>
      )}
    </button>
  );
});
