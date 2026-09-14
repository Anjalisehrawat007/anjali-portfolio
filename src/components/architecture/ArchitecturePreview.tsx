import type { Architecture } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NODE_KINDS } from "./nodeKinds";

/** Compact, non-interactive preview of an architecture for project cards. Lights up when `active`. */
export function ArchitecturePreview({ architecture, className, active }: { architecture: Architecture; className?: string; active?: boolean }) {
  const stages = architecture.stages.map((label, i) => ({
    label,
    nodes: architecture.nodes.filter((n) => n.stage === i),
  }));
  return (
    <div className={cn("canvas relative overflow-hidden rounded-xl p-3 transition-colors duration-300", className)} aria-hidden>
      {/* Rail with travelling packet */}
      <div className="rail absolute left-[19px] top-4 bottom-4 w-px bg-border-strong">
        <div className={cn("absolute inset-0 origin-top bg-[var(--tone,var(--accent))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", active ? "scale-y-100" : "scale-y-0")} />
        {active && <span className="rail-packet" />}
      </div>
      <ol className="relative space-y-2">
        {stages.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            <span
              className={cn(
                "relative z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-surface transition-all duration-300",
                active ? "border-[var(--tone,var(--accent))] shadow-[0_0_0_3px_var(--tone-soft,var(--accent-soft))]" : "border-border-strong",
              )}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", active ? "bg-[var(--tone,var(--accent))]" : "bg-border-strong")} style={{ transitionDelay: `${i * 70}ms` }} />
            </span>
            <span className="w-[84px] shrink-0 truncate font-mono text-[10px] uppercase tracking-wider text-muted">{s.label}</span>
            <span className="flex min-w-0 flex-1 flex-wrap gap-1">
              {s.nodes.map((n) => {
                const Icon = NODE_KINDS[n.kind].icon;
                return (
                  <span
                    key={n.id}
                    className={cn(
                      "inline-flex max-w-full items-center gap-1 truncate rounded-md border bg-surface px-1.5 py-0.5 text-[11px] text-fg-2 transition-colors duration-300",
                      active ? "border-[var(--tone-soft,var(--accent-soft))]" : "border-border",
                    )}
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    <Icon className={cn("h-3 w-3 shrink-0 transition-colors", active ? "text-[var(--tone,var(--accent))]" : "text-muted")} />
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
