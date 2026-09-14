"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Project } from "@/lib/types";
import { cn, formatPeriod } from "@/lib/utils";
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

  return (
    <motion.article
      layout={!reduced}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: dimmed ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={reduced ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-300",
        matched ? "border-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "border-border hover:border-border-strong hover:shadow-card",
        prominent && "md:col-span-2",
      )}
      aria-label={project.name}
    >
      <div className={cn("flex flex-col gap-5 p-5 sm:p-6", prominent && "md:grid md:grid-cols-[1.15fr_1fr] md:gap-8")}>
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={project.status} />
            <span className="font-mono text-[11px] text-muted">{formatPeriod(project.period)}</span>
            {matched && activeTech && <Badge tone="accent">uses {activeTech}</Badge>}
          </div>

          <h3 className={cn("mt-3 font-semibold tracking-tight text-fg", prominent ? "text-2xl sm:text-3xl" : "text-xl")}>
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {project.shortName}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">{project.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <Badge key={t} tone={activeTech && t.toLowerCase() === activeTech.toLowerCase() ? "accent" : "neutral"}>{t}</Badge>
            ))}
          </div>

          {/* Hover reveal: PRODUCT → ENGINEERING → PROOF */}
          <motion.div
            initial={false}
            animate={{ height: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            aria-hidden={!hover}
          >
            <dl className="mt-4 grid grid-cols-1 gap-2 rounded-xl border border-border bg-surface-2/60 p-3 text-xs sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-accent">Product</dt>
                <dd className="mt-0.5 leading-snug text-fg-2">{project.overview.split(". ")[0]}.</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-accent">Engineering</dt>
                <dd className="mt-0.5 leading-snug text-fg-2">{project.architecture.stages.join(" → ")}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-accent">Proof</dt>
                <dd className="mt-0.5 leading-snug text-fg-2">
                  {metric ? `${metric.value} ${metric.label.toLowerCase()}` : "Interactive architecture"}
                  {project.links.github ? " · GitHub" : ""}
                  {project.links.demo ? " · Live demo" : ""}
                </dd>
              </div>
            </dl>
          </motion.div>

          <div className="relative z-10 mt-auto pt-5">
            <ProjectLinks project={project} showCaseStudy={false} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {metric && (
            <div className="flex items-baseline gap-3 rounded-xl border border-border bg-surface-2/60 px-4 py-3">
              <span className="text-2xl font-semibold tabular-nums text-fg">{metric.value}</span>
              <span className="text-xs text-muted">{metric.label}{metric.context ? ` · ${metric.context}` : ""}</span>
            </div>
          )}
          <ArchitecturePreview architecture={project.architecture} active={hover || matched} className={cn(!prominent && "hidden sm:block")} />
          <div className="mt-auto flex items-center justify-between text-sm font-medium text-fg">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{project.categories.slice(0, 3).join(" · ")}</span>
            <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
              Explore case study <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
