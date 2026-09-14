"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Download, FileText, Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

const links = [
  { label: "GitHub", href: profile.github, icon: Github, hint: "@" + profile.githubUser },
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin, hint: "Profile" },
  { label: "Resume", href: "/resume", icon: FileText, hint: "View online" },
] as const;

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <Section id="contact" atmosphere="glow">
      <div className="card relative overflow-hidden rounded-[2rem] px-6 py-16 sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent-2/12 blur-3xl" />
          <div className="bg-grid mask-radial absolute inset-0 opacity-70" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-6 bg-accent/60" aria-hidden />Contact<span className="h-px w-6 bg-accent/60" aria-hidden />
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-fg sm:text-6xl">
            Let’s build something <span className="text-gradient">meaningful</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
            Open to software engineering and AI/ML roles. The fastest way to reach me is email.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={`mailto:${profile.email}`} size="lg" magnetic className="btn-icon-shift-up">
              <Mail className="h-4 w-4" /> {profile.email} <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </ButtonLink>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-fg-2 shadow-card-sm transition-colors hover:border-border-strong hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-live="polite"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>

          <ul className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card card-hover btn-icon-shift btn-icon-shift-up group flex items-center gap-3 rounded-xl px-4 py-3 text-left"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-fg-2 transition-colors group-hover:bg-accent group-hover:text-accent-fg">
                    <l.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-fg">{l.label}</span>
                    <span className="block truncate text-xs text-muted">{l.hint}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted" />
                </a>
              </li>
            ))}
          </ul>
          <a href={profile.resumeUrl} download={profile.resumeFileName} className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg">
            <Download className="h-3.5 w-3.5" /> Download resume PDF
          </a>
        </div>
      </div>
    </Section>
  );
}
