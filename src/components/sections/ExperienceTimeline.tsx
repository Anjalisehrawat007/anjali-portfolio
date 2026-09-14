"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Building2, MapPin } from "lucide-react";
import { experience } from "@/data/experience";
import { formatPeriod, cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { Section, SectionHeading } from "@/components/ui/Section";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { useExplorer } from "@/components/projects/ExplorerContext";
import { experienceForTech } from "@/data/skills";

export function ExperienceTimeline() {
  const { activeTech, focusTech } = useExplorer();
  const reduced = usePrefersReducedMotion();
  const highlighted = activeTech ? new Set(experienceForTech(activeTech)) : new Set<string>();
  const [inView, setInView] = useState<string | null>(null);

  // Rail fills as the list scrolls through the viewport.
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <Section id="experience" atmosphere="editorial">
      <SectionHeading
        eyebrow="Experience"
        title="Measured impact, not adjectives."
        description="Every number below is taken directly from the resume."
      />
      <ol ref={listRef} className="relative ml-3 sm:ml-6">
        {/* Rail: base line + animated fill */}
        <div className="absolute bottom-6 left-0 top-2 w-px bg-border" aria-hidden />
        <motion.div
          className="absolute left-0 top-2 w-px origin-top bg-gradient-to-b from-accent to-accent-2"
          style={{ height: "calc(100% - 2rem)", scaleY: reduced ? 1 : progress }}
          aria-hidden
        />
        {experience.map((e, i) => {
          const active = highlighted.has(e.id) || inView === e.id;
          const year = e.period.start.slice(0, 4);
          return (
            <Reveal as="li" key={e.id} delay={i * 0.06} className="relative pb-14 pl-10 last:pb-0 sm:pl-16">
              <motion.div
                onViewportEnter={() => setInView(e.id)}
                viewport={{ amount: 0.4, margin: "-10% 0px -30% 0px" }}
              >
                {/* Year marker + node */}
                <div className="absolute left-0 top-1 flex -translate-x-1/2 flex-col items-center">
                  <span
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded-full border-2 bg-bg transition-all duration-500",
                      active ? "border-accent shadow-[0_0_0_5px_var(--accent-soft)]" : "border-border-strong",
                    )}
                    aria-hidden
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-500", active ? "bg-accent" : "bg-transparent")} />
                  </span>
                </div>
                <span className={cn("absolute -left-1 top-8 -translate-x-full font-mono text-[11px] tracking-[0.18em] transition-colors duration-500 sm:top-0 sm:-translate-x-[calc(100%+0.75rem)]", active ? "text-accent" : "text-muted")}>
                  {year}
                </span>

                <article className={cn("card card-hover relative overflow-hidden rounded-2xl p-6 sm:p-7", active && "card-active")}>
                  <div className={cn("pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500", active ? "opacity-100" : "opacity-0")} aria-hidden />
                  <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{formatPeriod(e.period)}</p>
                      <h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-fg">{e.role}</h3>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-2">
                        <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-muted" /> {e.company}</span>
                        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted" /> {e.location}</span>
                      </p>
                    </div>
                    {e.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {e.technologies.map((t) => (
                          <button key={t} type="button" onClick={() => focusTech(t)} className="focus-visible:outline-none">
                            <Badge tone={activeTech?.toLowerCase() === t.toLowerCase() ? "accent" : "neutral"} className="cursor-pointer transition-colors hover:border-accent/50 hover:text-fg">{t}</Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <ul className="relative mt-5 space-y-2.5 text-[15px] leading-relaxed text-fg-2">
                    {e.highlights.map((h) => (
                      <li key={h} className="flex gap-3">
                        <span className="mt-[11px] h-1 w-3 shrink-0 rounded-full bg-accent/50" aria-hidden />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="relative mt-6 grid grid-cols-2 gap-3">
                    {e.metrics.map((m) => <MetricCard key={m.label} metric={m} size="sm" />)}
                  </div>
                </article>
              </motion.div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
