"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,border-color,transform,box-shadow] duration-200 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-bg hover:bg-fg/90",
  secondary: "bg-surface text-fg border border-border hover:border-border-strong hover:bg-surface-2",
  outline: "bg-transparent text-fg border border-border-strong hover:bg-surface-2",
  ghost: "bg-transparent text-fg-2 hover:text-fg hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-[15px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Subtle cursor-follow translation on hover (disabled with reduced motion). */
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, keyof CommonProps>;
type AnchorProps = CommonProps & Omit<ComponentProps<"a">, keyof CommonProps> & { href: string; external?: boolean };

/** Magnetic hover handlers that operate on the event target — no refs needed. */
function useMagnetic(enabled: boolean) {
  const reduced = usePrefersReducedMotion();
  const active = enabled && !reduced;
  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!active) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
  };
  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  };
  return { onMouseMove, onMouseLeave };
}

export function Button({ variant = "primary", size = "md", magnetic, className, children, ...rest }: ButtonProps) {
  const m = useMagnetic(!!magnetic);
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...m} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", magnetic, className, children, href, external, ...rest }: AnchorProps) {
  const m = useMagnetic(!!magnetic);
  const cls = cn(base, variants[variant], sizes[size], className);
  const isExternal = external || href.startsWith("http") || href.startsWith("mailto:") || href.endsWith(".pdf");
  if (isExternal) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...m} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...m} {...rest}>
      {children}
    </Link>
  );
}
