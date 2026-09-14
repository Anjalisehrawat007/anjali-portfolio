"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { X } from "lucide-react";
import { allCategories, featuredProjects } from "@/data/projects";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useExplorer } from "./ExplorerContext";
import { ProjectCard } from "./ProjectCard";

const FILTERS: (Category | "All")[] = ["All", ...allCategories];

export function ProjectExplorer() {
  const { category, setCategory, activeTech, setActiveTech } = useExplorer();
  const reduced = usePrefersReducedMotion();

  const visible = useMemo(
    () => featuredProjects.filter((p) => category === "All" || p.categories.includes(category)),
    [category],
  );

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of FILTERS) m.set(f, featuredProjects.filter((p) => f === "All" || p.categories.includes(f)).length);
    return m;
  }, []);

  return (
    <div>
      {/* Filter rail */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter projects by category" className="scrollbar-none -mx-5 flex gap-1.5 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {FILTERS.map((f) => {
            const active = category === f;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(f)}
                className={cn(
                  "relative shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                  active
                    ? "border-fg bg-fg text-bg shadow-[0_8px_20px_-12px_rgba(0,0,0,0.6)]"
                    : "border-border bg-surface/80 text-fg-2 backdrop-blur-sm hover:border-border-strong hover:bg-surface hover:text-fg",
                )}
              >
                {f}
                <span className={cn("ml-1.5 font-mono text-[10px]", active ? "text-bg/70" : "text-muted")}>{counts.get(f)}</span>
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {activeTech && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              onClick={() => setActiveTech(null)}
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-accent/40 bg-accent-soft px-3 py-1.5 text-[13px] font-medium text-accent"
            >
              Highlighting: {activeTech} <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <motion.div layout={!reduced} className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <ProjectCard key={p.slug} project={p} activeTech={activeTech} prominent={i === 0} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border-strong p-10 text-center text-sm text-muted">
          No projects in this category yet.
        </div>
      )}
    </div>
  );
}
