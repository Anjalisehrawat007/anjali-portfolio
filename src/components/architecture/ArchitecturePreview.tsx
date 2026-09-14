import type { Architecture } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NODE_KINDS } from "./nodeKinds";

/** Compact, non-interactive preview of an architecture for project cards. */
export function ArchitecturePreview({ architecture, className, active }: { architecture: Architecture; className?: string; active?: boolean }) {
  const stages = architecture.stages.map((label, i) => ({
    label,
    nodes: architecture.nodes.filter((n) => n.stage === i),
  }));
  return (
    <div className={cn("relative rounded-xl border border-border bg-surface-2/60 p-3", className)} aria-hidden>
      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border-strong" />
      <ol className="relative space-y-2">
        {stages.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            <span
              className={cn(
                "relative z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-surface transition-colors duration-300",
                active ? "border-accent" : "border-border-strong",
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", active ? "bg-accent" : "bg-border-strong")} style={{ transitionDelay: `${i * 60}ms` }} />
            </span>
            <span className="w-[84px] shrink-0 truncate font-mono text-[10px] uppercase tracking-wider text-muted">{s.label}</span>
            <span className="flex min-w-0 flex-1 flex-wrap gap-1">
              {s.nodes.map((n) => {
                const Icon = NODE_KINDS[n.kind].icon;
                return (
                  <span key={n.id} className="inline-flex max-w-full items-center gap-1 truncate rounded-md border border-border bg-surface px-1.5 py-0.5 text-[11px] text-fg-2">
                    <Icon className="h-3 w-3 shrink-0 text-muted" />
                    <span className="truncate">{n.label}</span>
                  </span>
                );
              })}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
