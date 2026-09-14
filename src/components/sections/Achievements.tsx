import { Award, BadgeCheck, Users } from "lucide-react";
import { achievements, certifications } from "@/data/achievements";
import { formatMonth } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Achievements() {
  return (
    <Section id="achievements" atmosphere="spot">
      <SectionHeading eyebrow="Achievements & involvement" title="Beyond the codebase." />
      <div className="grid gap-4 md:grid-cols-3">
        {achievements.map((a, i) => (
          <Reveal key={a.id} delay={i * 0.05} className="card card-hover relative flex flex-col overflow-hidden rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent">
                {a.id === "ecell" ? <Users className="h-4 w-4" /> : <Award className="h-4 w-4" />}
              </span>
              {a.period && <span className="font-mono text-[11px] text-muted">{a.period}</span>}
            </div>
            {a.highlight && <div className="metric-number mt-6 text-4xl font-semibold leading-[1.05] sm:text-[2.6rem]">{a.highlight}</div>}
            <h3 className={a.highlight ? "mt-2 text-sm font-medium text-fg-2" : "mt-5 text-lg font-semibold tracking-tight text-fg"}>{a.title}</h3>
            <p className="mt-1 text-sm text-muted">{a.detail}</p>
          </Reveal>
        ))}
      </div>

      <h3 className="mb-3 mt-12 font-mono text-[11px] uppercase tracking-wider text-muted">Certifications</h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {certifications.map((c) => (
          <li key={c.id} className="card card-hover flex items-center gap-3 rounded-xl px-4 py-3">
            <BadgeCheck className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-fg">{c.name}</div>
              <div className="text-xs text-muted">{c.issuer} · {formatMonth(c.date)}</div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
