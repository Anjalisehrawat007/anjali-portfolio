import type { SkillGroup } from "@/lib/types";
import { projects } from "./projects";
import { experience } from "./experience";

/** Source of truth: resume SKILLS section. */
export const skillGroups: SkillGroup[] = [
  { id: "languages", label: "Programming Languages", skills: ["Python", "Java", "C/C++"] },
  { id: "web", label: "Web Development", skills: ["HTML", "CSS", "MERN Stack", "Tailwind CSS"] },
  {
    id: "aiml",
    label: "AI/ML & Tools",
    skills: ["PyTorch", "HuggingFace Transformers", "Scikit-learn", "FastAPI", "Docker", "Git", "AWS/GCP"],
  },
  {
    id: "core",
    label: "Core Competencies",
    skills: ["Data Structures & Algorithms", "OOP", "Compiler Design", "Operating Systems", "Computer Networks"],
  },
];

/**
 * Some resume skills are spelled differently in project technology lists.
 * Map a skill → the technology names it should match. Only resume-supported
 * equivalences live here (HuggingFace Transformers ↔ BioBERT/Hugging Face).
 */
const aliases: Record<string, string[]> = {
  "HuggingFace Transformers": ["Hugging Face", "BioBERT"],
};

function matches(skill: string, tech: string) {
  if (tech.toLowerCase() === skill.toLowerCase()) return true;
  return (aliases[skill] ?? []).some((a) => a.toLowerCase() === tech.toLowerCase());
}

/** Project slugs that use a given technology (by resume-listed technology). */
export function projectsForTech(tech: string): string[] {
  return projects.filter((p) => p.technologies.some((t) => matches(tech, t))).map((p) => p.slug);
}

/** Experience ids that use a given technology. */
export function experienceForTech(tech: string): string[] {
  return experience.filter((e) => e.technologies.some((t) => matches(tech, t))).map((e) => e.id);
}

/** Every technology referenced by any project, deduplicated and sorted. */
export const projectTechnologies: string[] = Array.from(
  new Set(projects.flatMap((p) => p.technologies)),
).sort((a, b) => a.localeCompare(b));
