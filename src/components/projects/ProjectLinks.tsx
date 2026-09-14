import Link from "next/link";
import { ArrowUpRight, BookOpen, CircleDashed, Globe } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Demo / GitHub / Case study actions, rendered dynamically from `project.links`.
 *
 * - Live Demo → primary, product-style button (only when a URL exists).
 * - View on GitHub → secondary button (only when a URL exists).
 * - Missing repo → understated "Repository coming soon".
 * - Neither link → the original empty state (demo + repo placeholders).
 * Never renders a disabled or broken button.
 */
export function ProjectLinks({ project, size = "sm", showCaseStudy = true, className }: { project: Project; size?: "sm" | "md"; showCaseStudy?: boolean; className?: string }) {
  const { demo, github } = project.links;
  const base = cn(
    "inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3.5 text-sm",
  );
  const primary = "border-fg bg-fg text-bg hover:bg-fg/90";
  const secondary = "border-border bg-surface text-fg hover:border-border-strong hover:bg-surface-2";
  const soon = "border-dashed border-border text-muted cursor-default";
  const iconCls = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the live demo of ${project.shortName} (opens in a new tab)`}
          className={cn(base, primary, "group/demo")}
        >
          <Globe className={iconCls} aria-hidden /> Live Demo
          <ArrowUpRight className={cn("h-3 w-3 transition-transform group-hover/demo:-translate-y-px group-hover/demo:translate-x-px", size === "md" && "h-3.5 w-3.5")} aria-hidden />
        </a>
      )}
      {github ? (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View the ${project.shortName} repository on GitHub (opens in a new tab)`}
          className={cn(base, secondary, "group/gh")}
        >
          <Github className={iconCls} aria-hidden /> View on GitHub
          <ArrowUpRight className={cn("h-3 w-3 transition-transform group-hover/gh:-translate-y-px group-hover/gh:translate-x-px", size === "md" && "h-3.5 w-3.5")} aria-hidden />
        </a>
      ) : (
        <span className={cn(base, soon)} title="Repository not public yet">
          <Github className={iconCls} aria-hidden /> Repository coming soon
        </span>
      )}
      {!demo && !github && (
        <span className={cn(base, soon)} title="No public deployment yet">
          <CircleDashed className={iconCls} aria-hidden /> Demo coming soon
        </span>
      )}
      {showCaseStudy && (
        <Link href={`/projects/${project.slug}`} className={cn(base, primary)}>
          <BookOpen className={iconCls} aria-hidden /> Case study
        </Link>
      )}
    </div>
  );
}
