"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Menu, Moon, Sun, X } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { useActiveSection, useMounted, usePrefersReducedMotion, useScrollProgress, useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id);

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useScrolled(16);
  const progress = useScrollProgress();
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Scroll progress */}
      <div className="h-[2px] w-full bg-transparent" aria-hidden>
        <div className="h-full bg-accent transition-[width] duration-100 ease-linear" style={{ width: `${progress * 100}%` }} />
      </div>

      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter,height] duration-300",
          scrolled || open || !isHome
            ? "border-border bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center justify-between px-5 transition-[height] duration-300 sm:px-8",
            scrolled ? "h-14" : "h-16",
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-fg" aria-label="Home">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-fg font-mono text-[13px] font-bold text-bg">A</span>
            <span className="hidden sm:inline">{profile.firstName}</span>
            <span className="hidden font-normal text-muted md:inline">/ {profile.title.split(" — ")[0]}</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => {
              const isActive = isHome && active === s.id;
              return (
                <li key={s.id} className="relative">
                  <a
                    href={hrefFor(s.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative z-10 rounded-full px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {s.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-surface-2"
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hidden rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex">
              <Github className="h-4 w-4" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hidden rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex">
              <Linkedin className="h-4 w-4" />
            </a>
            <ThemeToggle />
            <Link
              href="/resume"
              className={cn(
                "hidden h-8 items-center gap-1.5 rounded-full bg-fg px-3.5 text-[13px] font-medium text-bg transition-colors hover:bg-fg/90 md:inline-flex",
                pathname === "/resume" && "ring-2 ring-accent ring-offset-2 ring-offset-bg",
              )}
            >
              <FileText className="h-3.5 w-3.5" /> Resume
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex rounded-md p-2 text-fg transition-colors hover:bg-surface-2 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            className="absolute inset-x-0 top-full h-[calc(100vh-4rem)] border-b border-border bg-bg/95 backdrop-blur-md md:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-5 py-4">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={hrefFor(s.id)}
                    onClick={() => setOpen(false)}
                    aria-current={isHome && active === s.id ? "location" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      isHome && active === s.id ? "bg-surface-2 text-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
                    )}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 border-t border-border pt-3">
                <Link href="/resume" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg bg-fg px-3 py-3 text-base font-medium text-bg">
                  <FileText className="h-4 w-4" /> Resume
                </Link>
              </li>
              <li className="mt-3 flex gap-2">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-fg-2">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-fg-2">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const mounted = useMounted();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted && resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {mounted && resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
