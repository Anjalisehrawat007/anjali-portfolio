import Link from "next/link";
import { ArrowUpRight, BookOpen, CircleDashed, Globe } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Demo / GitHub / Case study actions.
 * Missing URLs render an honest disabled state instead of a broken link, so
 * the layout does not change when links are added later.
 */
export function ProjectLinks({ project, size = "sm", showCaseStudy = true, className }: { project: Project; size?: "sm" | "md"; showCaseStudy?: boolean; className?: string }) {
  const base = cn(
    "inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors",
    size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3.5 text-sm",
  );
  const live = "border-border bg-surface text-fg hover:border-border-strong hover:bg-surface-2";
  const soon = "border-dashed border-border text-muted cursor-default";
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {project.links.demo ? (
        <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={cn(base, live)}>
          <Globe className="h-3.5 w-3.5" /> Live demo <ArrowUpRight className="h-3 w-3" />
        </a>
      ) : (
        <span className={cn(base, soon)} title="No public deployment yet" aria-disabled>
          <CircleDashed className="h-3.5 w-3.5" /> Demo coming soon
        </span>
      )}
      {project.links.github ? (
        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={cn(base, live)}>
          <Github className="h-3.5 w-3.5" /> GitHub <ArrowUpRight className="h-3 w-3" />
        </a>
      ) : (
        <span className={cn(base, soon)} title="Repository not public yet" aria-disabled>
          <Github className="h-3.5 w-3.5" /> Repository coming soon
        </span>
      )}
      {showCaseStudy && (
        <Link href={`/projects/${project.slug}`} className={cn(base, "border-fg bg-fg text-bg hover:bg-fg/90")}>
          <BookOpen className="h-3.5 w-3.5" /> Case study
        </Link>
      )}
    </div>
  );
}
