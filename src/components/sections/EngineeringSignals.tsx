"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { allCategories, featuredProjects } from "@/data/projects";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useExplorer } from "@/components/projects/ExplorerContext";

/**
 * Interactive map of engineering capabilities.
 * Categories and counts come straight from project data; hovering reveals the
 * projects and technologies behind each signal, clicking filters the explorer.
 */
export function EngineeringSignals() {
  const { setCategory } = useExplorer();
  const [hovered, setHovered] = useState<Category | null>(null);

  const signals = useMemo(
    () =>
      allCategories.map((c) => {
        const ps = featuredProjects.filter((p) => p.categories.includes(c));
        const tech = Array.from(new Set(ps.flatMap((p) => p.technologies))).slice(0, 6);
        return { id: c, projects: ps, tech };
      }),
    [],
  );
  const active = signals.find((s) => s.id === hovered) ?? null;

  const select = (c: Category) => {
    setCategory(c);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="card relative overflow-hidden rounded-2xl p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-spot opacity-60" aria-hidden />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Engineering signals</p>
          <ul className="flex flex-wrap gap-2" onMouseLeave={() => setHovered(null)}>
            {signals.map((s) => {
              const on = hovered === s.id;
              const dim = hovered !== null && !on;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(s.id)}
                    onFocus={() => setHovered(s.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => select(s.id)}
                    aria-label={`${s.id}: ${s.projects.length} project${s.projects.length === 1 ? "" : "s"}. Filter projects by ${s.id}.`}
                    className={cn(
                      "chip-dot inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] transition-all duration-200",
                      on
                        ? "border-accent bg-accent text-accent-fg shadow-[0_8px_20px_-10px_var(--accent)]"
                        : "border-border bg-surface text-fg-2 hover:border-border-strong hover:text-fg",
                      dim && "opacity-55",
                    )}
                  >
                    {s.id}
                    <span className={cn("font-mono text-[10px]", on ? "text-accent-fg/80" : "text-muted")}>{s.projects.length}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Supporting text updates with hover */}
        <div className="min-h-[76px] lg:w-[340px] lg:shrink-0 lg:border-l lg:border-border lg:pl-5" aria-live="polite">
          {active ? (
            <div key={active.id} className="animate-[pulse-soft_0.001s]">
              <p className="text-sm font-medium text-fg">
                {active.id} · {active.projects.map((p) => p.shortName).join(", ")}
              </p>
              <p className="mt-1.5 flex flex-wrap gap-1">
                {active.tech.map((t) => (
                  <span key={t} className="rounded bg-accent-soft px-1.5 py-px font-mono text-[10.5px] text-accent">{t}</span>
                ))}
              </p>
              <button type="button" onClick={() => select(active.id)} className="btn-icon-shift mt-2 inline-flex items-center gap-1 text-xs font-medium text-fg-2 hover:text-fg">
                Filter projects <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              Hover a signal to see the projects and technologies behind it. Click to filter the featured projects.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
