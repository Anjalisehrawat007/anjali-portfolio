"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

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
    <Section id="contact" className="border-t border-border">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 sm:px-12 sm:py-20">
        <div className="bg-grid mask-fade-y pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-5xl">Let’s build something that ships.</h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Open to software engineering and AI/ML roles. The fastest way to reach me is email.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href={`mailto:${profile.email}`} size="lg" magnetic>
              <Mail className="h-4 w-4" /> {profile.email}
            </ButtonLink>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg-2 transition-colors hover:border-border-strong hover:text-fg"
              aria-live="polite"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm text-fg-2 transition-colors hover:border-border-strong hover:text-fg">
              <Github className="h-4 w-4" /> GitHub <ArrowUpRight className="h-3 w-3" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm text-fg-2 transition-colors hover:border-border-strong hover:text-fg">
              <Linkedin className="h-4 w-4" /> LinkedIn <ArrowUpRight className="h-3 w-3" />
            </a>
            <a href={profile.resumeUrl} download={profile.resumeFileName} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm text-fg-2 transition-colors hover:border-border-strong hover:text-fg">
              <FileText className="h-4 w-4" /> Download resume
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
