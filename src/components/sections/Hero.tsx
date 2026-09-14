"use client";

import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: reduced ? { duration: 0 } : { duration: 0.6, ease, delay },
  });

  return (
    <section id="home" className="relative overflow-hidden pt-28 sm:pt-36">
      <div className="bg-grid mask-fade-y pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.p {...fade(0)} className="mb-5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
          Software Developer · AI/ML + Full-Stack
        </motion.p>
        <motion.h1 {...fade(0.05)} className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-fg sm:text-6xl md:text-7xl">
          <span className="block text-muted">{profile.firstName}.</span>
          <span className="block">I build intelligent, <span className="whitespace-nowrap">end-to-end</span> software systems.</span>
        </motion.h1>
        <motion.p {...fade(0.12)} className="mt-6 max-w-2xl text-base leading-relaxed text-fg-2 sm:text-lg">
          {profile.positioning}
        </motion.p>

        <motion.div {...fade(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="#projects" size="lg" magnetic>
            View Projects <ArrowDown className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/resume" size="lg" variant="secondary" magnetic>
            <FileText className="h-4 w-4" /> Resume
          </ButtonLink>
          <div className="ml-1 flex items-center gap-1">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg">
              <Github className="h-4 w-4" /> GitHub <ArrowUpRight className="h-3 w-3" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg">
              <Linkedin className="h-4 w-4" /> LinkedIn <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </motion.div>

        <motion.div {...fade(0.3)} className="mt-16 sm:mt-20">
          <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
            <span>How the systems I build are shaped</span>
            <span className="hidden sm:inline">hover a stage</span>
          </div>
          <HeroVisual />
        </motion.div>
      </div>
      <div className="mx-auto mt-16 h-px w-full max-w-6xl bg-border sm:mt-24" aria-hidden />
    </section>
  );
}
