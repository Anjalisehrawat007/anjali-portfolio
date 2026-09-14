import Link from "next/link";
import { Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { featuredProjects } from "@/data/projects";

export function Footer() {
  return (
    <footer className="relative bg-bg-2">
      <div className="divider absolute inset-x-0 top-0" aria-hidden />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-fg font-mono text-[13px] font-bold text-bg">A</span>
            {profile.fullName}
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{profile.headline} AI/ML and full-stack engineering, from model to deployment.</p>
          <div className="mt-4 flex gap-2">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-md border border-border p-2 text-muted transition-colors hover:border-border-strong hover:text-fg"><Github className="h-4 w-4" /></a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-md border border-border p-2 text-muted transition-colors hover:border-border-strong hover:text-fg"><Linkedin className="h-4 w-4" /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="rounded-md border border-border p-2 text-muted transition-colors hover:border-border-strong hover:text-fg"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">Projects</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {featuredProjects.map((p) => (
              <li key={p.slug}><Link href={`/projects/${p.slug}`} className="text-fg-2 transition-colors hover:text-fg">{p.shortName}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">Navigate</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/#experience" className="text-fg-2 transition-colors hover:text-fg">Experience</Link></li>
            <li><Link href="/#skills" className="text-fg-2 transition-colors hover:text-fg">Skills</Link></li>
            <li><Link href="/#github" className="text-fg-2 transition-colors hover:text-fg">Engineering activity</Link></li>
            <li><Link href="/resume" className="text-fg-2 transition-colors hover:text-fg">Resume</Link></li>
            <li><Link href="/#contact" className="text-fg-2 transition-colors hover:text-fg">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} {profile.fullName}. Built with Next.js, TypeScript, Tailwind CSS and Motion.</span>
          <span className="font-mono">All project and experience data is sourced from the resume — nothing here is fabricated.</span>
        </div>
      </div>
    </footer>
  );
}
