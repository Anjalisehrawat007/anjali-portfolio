"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleDashed, Globe } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import type { Project } from "@/lib/types";
import { featuredProjects } from "@/data/projects";
import { formatPeriod, cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/hooks";
import { Badge, StatusPill } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { ArchitectureDiagram } from "@/components/architecture/ArchitectureDiagram";
import { ProjectLinks } from "./ProjectLinks";
import { projectExtras } from "./extras";

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "implementation", label: "Technical implementation" },
  { id: "technologies", label: "Technologies" },
  { id: "challenges", label: "Engineering challenges" },
  { id: "metrics", label: "Metrics & results" },
  { id: "demo", label: "Demo" },
  { id: "github", label: "GitHub" },
  { id: "status", label: "Status" },
];
const TOC_IDS = TOC.map((t) => t.id);

export function ProjectCaseStudy({ project }: { project: Project }) {
  const active = useActiveSection(TOC_IDS);
  const idx = featuredProjects.findIndex((p) => p.slug === project.slug);
  const prev = featuredProjects[(idx - 1 + featuredProjects.length) % featuredProjects.length];
  const next = featuredProjects[(idx + 1) % featuredProjects.length];
  const extra = projectExtras[project.slug];

  return (
    <article className="mx-auto w-full max-w-6xl px-5 pb-24 pt-24 sm:px-8 sm:pt-28">
      {/* Header */}
      <header className="border-b border-border pb-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/#projects" className="inline-flex items-center gap-1 hover:text-fg"><ArrowLeft className="h-3.5 w-3.5" /> Projects</Link>
          <span aria-hidden>/</span>
          <span className="text-fg-2">{project.shortName}</span>
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={project.status} />
          <span className="font-mono text-[11px] text-muted">{formatPeriod(project.period)}</span>
          {project.categories.map((c) => <Badge key={c} tone="mono">{c}</Badge>)}
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">{project.name}</h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{project.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-1.5">{project.technologies.map((t) => <Badge key={t}>{t}</Badge>)}</div>
        <ProjectLinks project={project} size="md" showCaseStudy={false} className="mt-6" />
        {project.scopeNotes.length > 0 && (
          <ul className="mt-6 space-y-1 text-xs text-muted">
            {project.scopeNotes.map((n) => <li key={n} className="flex gap-2"><span aria-hidden>※</span>{n}</li>)}
          </ul>
        )}
      </header>

      <div className="grid gap-10 pt-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* TOC */}
        <div className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">On this page</p>
            <ol className="space-y-0.5 border-l border-border">
              {TOC.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} aria-current={active === t.id ? "location" : undefined} className={cn("-ml-px block border-l py-1 pl-3 text-[13px] transition-colors", active === t.id ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg")}>
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Body */}
        <div className="min-w-0 space-y-16">
          <CaseSection id="overview" title="Overview"><Prose>{project.overview}</Prose></CaseSection>
          <CaseSection id="problem" title="Problem"><Prose>{project.problem}</Prose></CaseSection>
          <CaseSection id="solution" title="Solution"><Prose>{project.solution}</Prose></CaseSection>

          <CaseSection id="architecture" title="Architecture" wide>
            <p className="mb-5 text-sm text-muted">Interactive — click a component for what it does, why it exists and the technology involved. Arrow keys move between components.</p>
            <ArchitectureDiagram architecture={project.architecture} title={project.shortName} />
            {project.media.architectureImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.media.architectureImage} alt={`${project.shortName} architecture`} className="mt-6 w-full rounded-2xl border border-border" />
            )}
            {extra && (
              <div className="mt-8">
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-fg">{extra.title}</h3>
                <extra.Component />
              </div>
            )}
          </CaseSection>

          <CaseSection id="implementation" title="Technical implementation">
            {project.implementation.length ? (
              <ol className="space-y-2.5">
                {project.implementation.map((s, i) => (
                  <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-fg-2">
                    <span className="mt-0.5 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ol>
            ) : <Placeholder />}
            {project.readme ? (
              <pre className="mt-6 whitespace-pre-wrap rounded-xl border border-border bg-surface-2/60 p-4 text-sm text-fg-2">{project.readme}</pre>
            ) : (
              <Placeholder className="mt-6" label="Detailed write-up coming soon" hint="Add `readme` in src/data/projects.ts to publish a longer technical write-up here." />
            )}
          </CaseSection>

          <CaseSection id="technologies" title="Technologies">
            <ul className="grid gap-2 sm:grid-cols-2">
              {project.technologies.map((t) => {
                const nodes = project.architecture.nodes.filter((n) => n.tech.includes(t));
                return (
                  <li key={t} className="rounded-xl border border-border bg-surface px-4 py-3">
                    <div className="text-sm font-semibold text-fg">{t}</div>
                    <div className="mt-0.5 text-xs text-muted">{nodes.length ? `Used in: ${nodes.map((n) => n.label).join(", ")}` : "Listed for this project"}</div>
                  </li>
                );
              })}
            </ul>
          </CaseSection>

          <CaseSection id="challenges" title="Engineering challenges">
            <p className="mb-4 text-xs text-muted">Design considerations implied by the stated architecture. Detailed write-ups coming soon.</p>
            {project.challenges.length ? (
              <ul className="space-y-2.5">
                {project.challenges.map((c) => (
                  <li key={c} className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-fg-2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{c}
                  </li>
                ))}
              </ul>
            ) : <Placeholder />}
          </CaseSection>

          <CaseSection id="metrics" title="Metrics & results">
            {project.metrics.length ? (
              <div className="grid gap-3 sm:grid-cols-2">{project.metrics.map((m) => <MetricCard key={m.label} metric={m} size="lg" />)}</div>
            ) : (
              <Placeholder label="No quantitative results reported yet" hint="Only metrics stated in the source material are shown. Add entries to `metrics` in src/data/projects.ts." />
            )}
          </CaseSection>

          <CaseSection id="demo" title="Demo">
            {project.links.demo ? (
              <div>
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" aria-label={`Open the live demo of ${project.shortName} (opens in a new tab)`} className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-colors hover:bg-fg/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
                <Globe className="h-4 w-4" aria-hidden /> Live Demo <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <p className="mt-3 font-mono text-xs text-muted">{project.links.demo}</p>
              </div>
            ) : (
              <Placeholder label="Demo coming soon" hint="No public deployment yet. Set `links.demo` to enable the button — the layout is already in place." />
            )}
            {project.media.video && (
              <video src={project.media.video} controls className="mt-6 w-full rounded-2xl border border-border" />
            )}
            {project.media.screenshots.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.media.screenshots.map((s) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={s.src} src={s.src} alt={s.alt} loading="lazy" className="w-full rounded-xl border border-border" />
                ))}
              </div>
            )}
          </CaseSection>

          <CaseSection id="github" title="GitHub">
            {project.links.github ? (
              <div>
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" aria-label={`View the ${project.shortName} repository on GitHub (opens in a new tab)`} className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
                <Github className="h-4 w-4" aria-hidden /> View on GitHub <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <p className="mt-3 font-mono text-xs text-muted">{project.links.github}</p>
              </div>
            ) : (
              <Placeholder label="Repository coming soon" hint="Set `links.github` in src/data/projects.ts once the repository is public. Public activity is visible on the GitHub profile." />
            )}
            <Link href="/#github" className="mt-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">See live engineering activity <ArrowRight className="h-3.5 w-3.5" /></Link>
          </CaseSection>

          <CaseSection id="status" title="Status">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <StatusPill status={project.status} />
              <span className="text-fg-2">{formatPeriod(project.period)}</span>
              {project.status === "ongoing" && <span className="inline-flex items-center gap-1 text-muted"><CircleDashed className="h-3.5 w-3.5" /> Actively developed</span>}
            </div>
          </CaseSection>

          {/* Prev / next */}
          <nav aria-label="More projects" className="grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
            <Link href={`/projects/${prev.slug}`} className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
              <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted"><ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" /> Previous</span>
              <span className="mt-1 block text-base font-semibold text-fg">{prev.shortName}</span>
            </Link>
            <Link href={`/projects/${next.slug}`} className="group rounded-2xl border border-border bg-surface p-5 text-right transition-colors hover:border-border-strong">
              <span className="flex items-center justify-end gap-1 font-mono text-[11px] uppercase tracking-wider text-muted">Next <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
              <span className="mt-1 block text-base font-semibold text-fg">{next.shortName}</span>
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
}

function CaseSection({ id, title, children, wide }: { id: string; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <Reveal as="section" className={cn("scroll-mt-24", !wide && "max-w-3xl")}>
      <div id={id} className="scroll-mt-24">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-fg sm:text-2xl">{title}</h2>
        {children}
      </div>
    </Reveal>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-fg-2 sm:text-base">{children}</p>;
}
