import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { certifications } from "@/data/achievements";
import { formatMonth, formatPeriod } from "@/lib/utils";
import { ResumeViewer } from "@/components/resume/ResumeViewer";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.fullName}: software developer specialising in AI/ML and full-stack engineering.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="bg-ambient mask-fade-b pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]" aria-hidden />
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent"><span className="h-px w-6 bg-accent/60" aria-hidden />Resume</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-fg sm:text-5xl">Professional snapshot.</h1>
          <p className="mt-3 max-w-xl text-muted sm:text-lg">The concise version. The rest of this site is the interactive proof.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-icon-shift btn-icon-shift-up inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-fg shadow-card-sm transition-colors hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
            View Resume <ArrowUpRight className="h-4 w-4" />
          </a>
          <a href={profile.resumeUrl} download={profile.resumeFileName} className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg shadow-[0_8px_20px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-fg/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
            Download PDF <Download className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ResumeViewer />

        <aside className="space-y-4">
          <Card title="Education">
            <div className="text-sm font-medium text-fg">{profile.education.degree}</div>
            <div className="text-sm text-fg-2">{profile.education.school}</div>
            <div className="mt-1 flex justify-between text-xs text-muted"><span>{formatPeriod(profile.education.period)}</span><span>CGPA {profile.education.cgpa}</span></div>
          </Card>
          <Card title="Experience">
            <ul className="space-y-3">
              {experience.map((e) => (
                <li key={e.id}>
                  <div className="text-sm font-medium text-fg">{e.role}</div>
                  <div className="text-xs text-fg-2">{e.company} · {e.location}</div>
                  <div className="text-xs text-muted">{formatPeriod(e.period)}</div>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Projects">
            <ul className="space-y-2">
              {featuredProjects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="group flex items-center justify-between text-sm text-fg-2 hover:text-fg">
                    {p.shortName} <ArrowRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skillGroups.flatMap((g) => g.skills).map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
          </Card>
          <Card title="Certifications">
            <ul className="space-y-1.5 text-sm">
              {certifications.map((c) => <li key={c.id} className="flex justify-between gap-2 text-fg-2"><span>{c.name}</span><span className="shrink-0 text-xs text-muted">{formatMonth(c.date)}</span></li>)}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card rounded-2xl p-5">
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{title}</h2>
      {children}
    </div>
  );
}
