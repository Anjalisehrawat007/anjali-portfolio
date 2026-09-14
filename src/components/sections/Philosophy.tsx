import Link from "next/link";
import { philosophy } from "@/data/philosophy";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

function evidenceLabel(id: string) {
  const p = projects.find((x) => x.slug === id);
  if (p) return { label: p.shortName, href: `/projects/${p.slug}` };
  const e = experience.find((x) => x.id === id);
  if (e) return { label: e.company, href: "/#experience" };
  return null;
}

export function Philosophy() {
  return (
    <Section id="philosophy">
      <SectionHeading eyebrow="Engineering philosophy" title="How I think about building." description="Six themes, each backed by something on this page." />
      <ol className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        {philosophy.map((t, i) => (
          <Reveal as="li" key={t.id} delay={i * 0.04} className="group relative pl-12">
            <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface font-mono text-[11px] text-muted transition-colors group-hover:border-accent/50 group-hover:text-accent">0{i + 1}</span>
            <h3 className="text-xl font-semibold tracking-tight text-fg">{t.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-2">{t.body}</p>
            {t.evidence.length > 0 && (
              <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-mono uppercase tracking-wider text-muted">Evidence</span>
                {t.evidence.map((id) => {
                  const ev = evidenceLabel(id);
                  return ev ? (
                    <Link key={id} href={ev.href} className="rounded-md border border-border bg-surface px-2 py-0.5 text-fg-2 transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent">{ev.label}</Link>
                  ) : null;
                })}
              </p>
            )}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
