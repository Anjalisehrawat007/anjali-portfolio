import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  id,
  children,
  className,
  bleed,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Skip the max-width container (child handles it). */
  bleed?: boolean;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-20 sm:py-28", className)}>
      {bleed ? children : <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>}
    </section>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base leading-relaxed text-muted sm:text-[17px]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
