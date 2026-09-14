import type { Metric } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MetricCard({ metric, size = "md", className }: { metric: Metric; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong",
        size === "lg" && "p-6",
        className,
      )}
    >
      <div
        className={cn(
          "font-semibold tracking-tight text-fg tabular-nums",
          size === "sm" && "text-2xl",
          size === "md" && "text-3xl",
          size === "lg" && "text-5xl",
        )}
      >
        {metric.value}
      </div>
      <div className="mt-1.5 text-sm font-medium text-fg-2">{metric.label}</div>
      {metric.context && <div className="mt-0.5 text-xs text-muted">{metric.context}</div>}
      <div className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-wider text-muted">
        {metric.source}
      </div>
    </div>
  );
}
