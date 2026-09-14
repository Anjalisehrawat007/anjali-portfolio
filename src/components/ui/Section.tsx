import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Atmosphere = "plain" | "grid" | "ambient" | "editorial" | "spot" | "glow";

/** Section-specific background treatments — all subtle, all masked into the page. */
const atmospheres: Record<Atmosphere, ReactNode> = {
  plain: null,
  grid: <div className="bg-grid mask-radial pointer-events-none absolute inset-0 -z-10" aria-hidden />,
  ambient: <div className="bg-ambient mask-fade-y pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden />,
  editorial: (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border/60 lg:block" />
      <div className="bg-spot-2 mask-fade-y absolute inset-0 opacity-70" />
    </div>
  ),
  spot: <div className="bg-spot mask-fade-y pointer-events-none absolute inset-0 -z-10" aria-hidden />,
  glow: (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <div className="bg-ambient mask-fade-y absolute inset-0" />
      <div className="bg-grid mask-radial absolute inset-0 opacity-60" />
    </div>
  ),
};

export function Section({
  id,
  children,
  className,
  bleed,
  atmosphere = "plain",
  divider = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Skip the max-width container (child handles it). */
  bleed?: boolean;
  atmosphere?: Atmosphere;
  /** Fading hairline at the top instead of a hard border. */
  divider?: boolean;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-24 sm:py-32", className)}>
      {divider && <div className="divider absolute inset-x-0 top-0" aria-hidden />}
      {atmospheres[atmosphere]}
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
        "mb-12 flex flex-col gap-5 sm:mb-16 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-6 bg-accent/60" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-[2.75rem] sm:leading-[1.08]">{title}</h2>
        {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-[17px]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
