"use client";

import { useState, type PointerEvent } from "react";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { motion } from "motion/react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { HeroVisual } from "./HeroVisual";
import { EngineeringSignals } from "./EngineeringSignals";
import { ProofStrip } from "./ProofStrip";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: reduced ? { duration: 0 } : { duration: 0.7, ease, delay },
  });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 sm:pt-40"
      onPointerMove={onMove}
      onPointerLeave={() => setPointer(null)}
    >
      {/* Atmosphere: ambient colour field + engineering grid + cursor glow */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="bg-ambient absolute inset-0 motion-safe:animate-[drift_18s_ease-in-out_infinite]" />
        <div className="bg-grid mask-fade-y absolute inset-0" />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: pointer ? 1 : 0,
            background: `radial-gradient(520px circle at ${((pointer?.x ?? 0) + 0.5) * 100}% ${((pointer?.y ?? 0) + 0.5) * 100}%, var(--glow-1), transparent 65%)`,
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.p {...fade(0)} className="mb-6 flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Software Developer · AI/ML + Full-Stack · Open to roles
        </motion.p>

        <motion.h1 {...fade(0.05)} className="max-w-5xl text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] text-fg sm:text-6xl md:text-[5.25rem]">
          <span className="block text-muted/70">{profile.firstName}.</span>
          <span className="block">
            I build <span className="text-gradient">intelligent</span>, <span className="whitespace-nowrap">end-to-end</span> software systems.
          </span>
        </motion.h1>

        <motion.p {...fade(0.12)} className="mt-7 max-w-2xl text-base leading-relaxed text-fg-2 sm:text-lg">
          {profile.positioning}
        </motion.p>

        <motion.div {...fade(0.18)} className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink href="#projects" size="lg" magnetic>
            View Projects <ArrowDown className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/resume" size="lg" variant="secondary" magnetic className="btn-icon-shift-up">
            <FileText className="h-4 w-4" /> Resume <ArrowUpRight className="h-3.5 w-3.5 text-muted" />
          </ButtonLink>
          <div className="ml-1 flex items-center gap-1">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-icon-shift btn-icon-shift-up inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg">
              <Github className="h-4 w-4" /> GitHub <ArrowUpRight className="h-3 w-3" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-icon-shift btn-icon-shift-up inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg">
              <Linkedin className="h-4 w-4" /> LinkedIn <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </motion.div>

        <motion.div {...fade(0.24)}>
          <ProofStrip />
        </motion.div>

        <motion.div {...fade(0.3)} className="mt-16 sm:mt-20">
          <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="inline-flex items-center gap-2"><span className="h-px w-6 bg-border-strong" aria-hidden />How the systems I build are shaped</span>
            <span className="hidden sm:inline">hover a stage</span>
          </div>
          <HeroVisual pointer={pointer} />
        </motion.div>

        <motion.div {...fade(0.4)} className="mt-6">
          <EngineeringSignals />
        </motion.div>
      </div>
      <div className="mx-auto mt-20 max-w-6xl sm:mt-28">
        <div className="divider" aria-hidden />
      </div>
    </section>
  );
}
