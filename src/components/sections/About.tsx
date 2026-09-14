import { GraduationCap } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { formatPeriod } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  const facts = [
    { k: "Focus", v: "AI/ML + Full-Stack" },
    { k: "Featured systems", v: String(projects.length) },
    { k: "Domains", v: "Healthcare AI · Identity · Infrastructure" },
    { k: "Serving", v: "FastAPI · Flask · Docker · AWS/GCP" },
  ];
  return (
    <Section id="about" atmosphere="ambient">
      <SectionHeading eyebrow="About" title="Technical profile." />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-4 text-[15px] leading-relaxed text-fg-2 sm:text-base">
          {profile.about.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        </Reveal>
        <Reveal delay={0.08} className="space-y-4">
          <div className="card relative overflow-hidden rounded-2xl p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" aria-hidden />
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted"><GraduationCap className="h-3.5 w-3.5" /> Education</div>
            <h3 className="mt-2 text-base font-semibold text-fg">{profile.education.degree}</h3>
            <p className="text-sm text-fg-2">{profile.education.school}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted">{formatPeriod(profile.education.period)}</span>
              <span className="font-medium text-fg">CGPA {profile.education.cgpa}</span>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {facts.map((f) => (
              <div key={f.k} className="card card-hover rounded-xl p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{f.k}</dt>
                <dd className="mt-1 text-sm font-medium text-fg">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
