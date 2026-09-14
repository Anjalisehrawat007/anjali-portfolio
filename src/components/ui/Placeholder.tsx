import { cn } from "@/lib/utils";
import { CircleDashed } from "lucide-react";

/** Honest empty state: used wherever source material has no detail yet. */
export function Placeholder({ label = "Details coming soon", hint, className }: { label?: string; hint?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-dashed border-border-strong bg-surface-2/50 p-4 text-sm",
        className,
      )}
    >
      <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
      <div>
        <div className="font-medium text-fg-2">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
      </div>
    </div>
  );
}
