import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "accent" | "success" | "warning" | "mono";
}) {
  const tones = {
    neutral: "bg-surface-2 text-fg-2 border-border",
    accent: "bg-accent-soft text-accent border-accent/30",
    success: "bg-success/10 text-success border-success/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    mono: "bg-transparent text-muted border-border font-mono uppercase tracking-wider text-[10.5px]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium leading-5",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: "ongoing" | "completed" }) {
  return status === "ongoing" ? (
    <Badge tone="success" className="gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
      </span>
      Ongoing
    </Badge>
  ) : (
    <Badge tone="neutral">Completed</Badge>
  );
}
