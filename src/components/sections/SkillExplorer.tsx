"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ArrowRight, Briefcase, FolderGit2, X } from "lucide-react";
import { skillGroups, projectsForTech, experienceForTech, projectTechnologies } from "@/data/skills";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { useExplorer } from "@/components/projects/ExplorerContext";
import { TechGraph } from "./TechGraph";

export function SkillExplorer() {
  const { activeTech, setActiveTech, focusTech } = useExplorer();
  const reduced = usePrefersReducedMotion();

  const resumeSkills = useMemo(() => new Set(skillGroups.flatMap((g) => g.skills.map((s) => s.toLowerCase()))), []);
  const extraTech = useMemo(
    () => projectTechnologies.filter((t) => !resumeSkills.has(t.toLowerCase()) && t !== "Hugging Face" && t !== "BioBERT" && t !== "Python"),
    [resumeSkills],
  );

  const linkedProjects = activeTech ? projectsForTech(activeTech).map((s) => projects.find((p) => p.slug === s)!) : [];
  const linkedExperience = activeTech ? experienceForTech(activeTech).map((id) => experience.find((e) => e.id === id)!) : [];

  const Chip = ({ label }: { label: string }) => {
    const active = activeTech?.toLowerCase() === label.toLowerCase();
    const n = projectsForTech(label).length + experienceForTech(label).length;
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setActiveTech(active ? null : label)}
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all duration-200",
          active
            ? "border-accent bg-accent text-accent-fg shadow-[0_8px_20px_-10px_var(--accent)]"
            : n > 0
              ? "border-border bg-surface text-fg-2 shadow-card-sm hover:-translate-y-px hover:border-accent/50 hover:text-fg"
              : "border-border bg-surface/60 text-muted hover:border-border-strong hover:text-fg-2",
          activeTech && !active && "opacity-70",
        )}
      >
        {label}
        {n > 0 && <span className={cn("font-mono text-[10px]", active ? "text-accent-fg/80" : "text-muted")}>{n}</span>}
      </button>
    );
  };

  return (
    <Section id="skills" atmosphere="ambient">
      <SectionHeading
        eyebrow="Technical ecosystem"
        title="Skills, connected to the work."
        description="No percentage bars. Select a technology to see the projects and roles it appears in; the number is how many."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-7">
          {skillGroups.map((g) => (
            <div key={g.id}>
              <h3 className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-muted">{g.label}</h3>
              <div className="flex flex-wrap gap-2">{g.skills.map((s) => <Chip key={s} label={s} />)}</div>
            </div>
          ))}
          {extraTech.length > 0 && (
            <div>
              <h3 className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-muted">Also used in projects</h3>
              <div className="flex flex-wrap gap-2">{extraTech.map((s) => <Chip key={s} label={s} />)}</div>
            </div>
          )}
        </div>

        {/* Relationship panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTech ?? "__none"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
              className={cn("card relative overflow-hidden rounded-2xl p-5", activeTech && "card-active")}
            >
              {!activeTech ? (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Relationships</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-2">
                    Select a technology. This panel shows the projects and experience where it appears, based only on the resume.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent">Selected</p>
                      <h4 className="mt-1 text-lg font-semibold tracking-tight text-fg">{activeTech}</h4>
                    </div>
                    <button type="button" onClick={() => setActiveTech(null)} aria-label="Clear selection" className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-fg"><X className="h-4 w-4" /></button>
                  </div>

                  <div className="mt-4">
                    <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted"><FolderGit2 className="h-3.5 w-3.5" /> Projects</p>
                    {linkedProjects.length ? (
                      <ul className="mt-2 space-y-1.5">
                        {linkedProjects.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/projects/${p.slug}`} className="group flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm text-fg transition-colors hover:border-accent">
                              {p.shortName} <ArrowRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted">No featured project lists this yet — it’s a resume skill without a linked project.</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted"><Briefcase className="h-3.5 w-3.5" /> Experience</p>
                    {linkedExperience.length ? (
                      <ul className="mt-2 space-y-1.5">
                        {linkedExperience.map((e) => (
                          <li key={e.id}>
                            <a href="#experience" className="group flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm text-fg transition-colors hover:border-accent">
                              <span>{e.role} · <span className="text-muted">{e.company}</span></span>
                              <ArrowRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted">Not tied to a listed role.</p>
                    )}
                  </div>

                  {linkedProjects.length > 0 && (
                    <button type="button" onClick={() => focusTech(activeTech)} className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-fg px-3 py-2 text-sm font-medium text-bg hover:bg-fg/90">
                      Highlight in projects <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="mb-1 text-xl font-semibold tracking-tight text-fg">Technology ↔ project graph</h3>
        <p className="mb-5 text-sm text-muted">Edges exist only where the resume lists the technology for that project.</p>
        <TechGraph />
      </div>
    </Section>
  );
}
