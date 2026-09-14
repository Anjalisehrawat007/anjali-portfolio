"use client";

import { Building2, MapPin } from "lucide-react";
import { experience } from "@/data/experience";
import { formatPeriod, cn } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { useExplorer } from "@/components/projects/ExplorerContext";
import { experienceForTech } from "@/data/skills";

export function ExperienceTimeline() {
  const { activeTech, focusTech } = useExplorer();
  const highlighted = activeTech ? new Set(experienceForTech(activeTech)) : new Set<string>();

  return (
    <Section id="experience" className="border-t border-border">
      <SectionHeading
        eyebrow="Experience"
        title="Measured impact, not adjectives."
        description="Every number below is taken directly from the resume."
      />
      <ol className="relative ml-3 border-l border-border sm:ml-4">
        {experience.map((e, i) => {
          const active = highlighted.has(e.id);
          return (
            <Reveal as="li" key={e.id} delay={i * 0.06} className="relative pb-12 pl-8 last:pb-0 sm:pl-12">
              <span
                className={cn(
                  "absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-bg transition-colors",
                  active ? "border-accent" : "border-border-strong",
                )}
                aria-hidden
              />
              <article className={cn("rounded-2xl border bg-surface p-5 transition-colors sm:p-6", active ? "border-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "border-border")}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{formatPeriod(e.period)}</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-fg">{e.role}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-2">
                      <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-muted" /> {e.company}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted" /> {e.location}</span>
                    </p>
                  </div>
                  {e.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {e.technologies.map((t) => (
                        <button key={t} type="button" onClick={() => focusTech(t)} className="focus-visible:outline-none">
                          <Badge tone={activeTech?.toLowerCase() === t.toLowerCase() ? "accent" : "neutral"} className="cursor-pointer transition-colors hover:border-border-strong">{t}</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-2">
                  {e.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {e.metrics.map((m) => <MetricCard key={m.label} metric={m} size="sm" />)}
                </div>
              </article>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
