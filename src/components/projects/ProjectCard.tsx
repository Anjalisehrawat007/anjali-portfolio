"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Project } from "@/lib/types";
import { cn, formatPeriod } from "@/lib/utils";
import { toneVars } from "@/lib/tones";
import { Badge, StatusPill } from "@/components/ui/Badge";
import { ArchitecturePreview } from "@/components/architecture/ArchitecturePreview";
import { ProjectLinks } from "./ProjectLinks";

interface Props {
  project: Project;
  /** Technology currently selected in the explorer. */
  activeTech: string | null;
  /** Hero layout for the first featured project. */
  prominent?: boolean;
  index: number;
}

function usesTech(project: Project, tech: string | null) {
  if (!tech) return false;
  const t = tech.toLowerCase();
  return project.technologies.some((x) => x.toLowerCase() === t)
    || (t === "huggingface transformers" && project.technologies.some((x) => ["hugging face", "biobert"].includes(x.toLowerCase())));
}

export function ProjectCard({ project, activeTech, prominent, index }: Props) {
  const reduced = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const matched = usesTech(project, activeTech);
  const dimmed = !!activeTech && !matched;
  const metric = project.metrics[0];
  const lit = hover || matched;

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      layout={!reduced}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: dimmed ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={reduced ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
      style={toneVars(project.slug) as React.CSSProperties}
      className={cn(
        "card card-hover spotlight group relative flex flex-col overflow-hidden rounded-3xl",
        matched && "card-active",
        prominent && "md:col-span-2",
      )}
      aria-label={project.name}
    >
      {/* Project tone: top hairline + soft corner glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--tone)] to-transparent opacity-70" aria-hidden />
      <div className={cn("pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500", lit ? "opacity-100" : "opacity-40")} style={{ background: "var(--tone-glow)" }} aria-hidden />

      <div className={cn("relative flex flex-col gap-6 p-6 sm:p-7", prominent && "md:grid md:grid-cols-[1.15fr_1fr] md:gap-10")}>
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={project.status} />
            <span className="font-mono text-[11px] tracking-wider text-muted">{formatPeriod(project.period)}</span>
            {matched && activeTech && <Badge tone="accent">uses {activeTech}</Badge>}
          </div>

          <h3 className={cn("mt-4 font-semibold tracking-[-0.03em] text-fg", prominent ? "text-3xl sm:text-4xl" : "text-2xl")}>
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {project.shortName}
            </Link>
          </h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted sm:text-base">{project.tagline}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => {
              const isActive = !!activeTech && t.toLowerCase() === activeTech.toLowerCase();
              return (
                <Badge
                  key={t}
                  tone={isActive ? "accent" : "neutral"}
                  className={cn("transition-colors duration-300", !isActive && lit && "border-[var(--tone-soft)] bg-surface")}
                >
                  {t}
                </Badge>
              );
            })}
          </div>

          {/* Hover reveal: PRODUCT → ENGINEERING → PROOF */}
          <motion.div
            initial={false}
            animate={{ height: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            aria-hidden={!hover}
          >
            <dl className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-border bg-surface-2/70 p-3.5 text-xs sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--tone)" }}>Product</dt>
                <dd className="mt-1 leading-snug text-fg-2">{project.overview.split(". ")[0]}.</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--tone)" }}>Engineering</dt>
                <dd className="mt-1 leading-snug text-fg-2">{project.architecture.stages.join(" → ")}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--tone)" }}>Proof</dt>
                <dd className="mt-1 leading-snug text-fg-2">
                  {metric ? `${metric.value} ${metric.label.toLowerCase()}` : "Interactive architecture"}
                  {project.links.github ? " · GitHub" : ""}
                  {project.links.demo ? " · Live Demo" : ""}
                </dd>
              </div>
            </dl>
          </motion.div>

          <div className="relative z-10 mt-auto pt-6">
            <ProjectLinks project={project} showCaseStudy={false} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {metric && (
            <div className={cn("relative flex items-baseline gap-3 overflow-hidden rounded-xl border border-border bg-surface-2/70 px-4 py-3 transition-all duration-300", lit && "border-[var(--tone-soft)]")}>
              <span className={cn("metric-number text-3xl font-semibold transition-transform duration-300 origin-left", lit && "scale-105")}>{metric.value}</span>
              <span className="text-xs text-muted">{metric.label}{metric.context ? ` · ${metric.context}` : ""}</span>
            </div>
          )}
          <ArchitecturePreview architecture={project.architecture} active={lit} className={cn(!prominent && "hidden sm:block")} />
          <div className="mt-auto flex items-center justify-between pt-1 text-sm font-medium text-fg">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">{project.categories.slice(0, 3).join(" · ")}</span>
            <span className="inline-flex items-center gap-1.5">
              Explore case study
              <span className={cn("grid h-6 w-6 place-items-center rounded-full border border-border bg-surface transition-all duration-300", lit && "border-[var(--tone)] bg-[var(--tone)] text-white")}>
                <ArrowRight className={cn("h-3.5 w-3.5 transition-transform duration-300", lit && "translate-x-px")} />
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
