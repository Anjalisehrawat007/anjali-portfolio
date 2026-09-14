"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { featuredProjects } from "@/data/projects";
import { projectTechnologies } from "@/data/skills";
import { useFlowEdges } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { FlowEdges } from "@/components/architecture/FlowEdges";
import { useExplorer } from "@/components/projects/ExplorerContext";

/** Bipartite technology → project graph with DOM-anchored SVG edges. */
export function TechGraph() {
  const { activeTech, setActiveTech } = useExplorer();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());

  const edges = useMemo(
    () => featuredProjects.flatMap((p) => p.technologies.map((t) => ({ from: `t:${t}`, to: `p:${p.slug}` }))),
    [],
  );
  const { geometry, size } = useFlowEdges(containerRef, nodeRefs, edges);
  const activeId = activeTech ? `t:${projectTechnologies.find((t) => t.toLowerCase() === activeTech.toLowerCase()) ?? activeTech}` : null;
  const activeProjects = useMemo(() => new Set(edges.filter((e) => e.from === activeId).map((e) => e.to)), [edges, activeId]);

  return (
    <div ref={containerRef} className="relative rounded-2xl border border-border bg-surface-2/40 p-4 sm:p-6">
      <FlowEdges geometry={geometry} edges={edges} size={size} activeId={activeId} animate={false} showLabels={false} />
      <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-10 sm:gap-x-24 md:gap-x-40">
        <ul className="flex flex-col items-start gap-2" aria-label="Technologies">
          {projectTechnologies.map((t) => {
            const active = activeId === `t:${t}`;
            return (
              <li key={t} ref={(el) => { if (el) nodeRefs.current.set(`t:${t}`, el); else nodeRefs.current.delete(`t:${t}`); }}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveTech(active ? null : t)}
                  onMouseEnter={() => { if (!activeTech) setActiveTech(t); }}
                  onMouseLeave={() => { if (activeTech === t) setActiveTech(null); }}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    active ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface text-fg-2 hover:border-border-strong",
                  )}
                >
                  {t}
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="flex flex-col items-end justify-around gap-6" aria-label="Projects">
          {featuredProjects.map((p) => {
            const lit = activeProjects.has(`p:${p.slug}`);
            return (
              <li key={p.slug} ref={(el) => { if (el) nodeRefs.current.set(`p:${p.slug}`, el); else nodeRefs.current.delete(`p:${p.slug}`); }}>
                <Link
                  href={`/projects/${p.slug}`}
                  className={cn(
                    "block max-w-[200px] rounded-xl border bg-surface px-3.5 py-2.5 text-right transition-colors",
                    lit ? "border-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "border-border hover:border-border-strong",
                  )}
                >
                  <span className="block text-sm font-semibold text-fg">{p.shortName}</span>
                  <span className="block text-[11px] text-muted">{p.technologies.length} technologies</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
