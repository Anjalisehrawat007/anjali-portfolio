import type { Experience } from "@/lib/types";

/** Source of truth: resume (Sep 2026). */
export const experience: Experience[] = [
  {
    id: "ayuka",
    role: "Software Engineer",
    company: "Ayuka Developers",
    location: "Gohana",
    period: { start: "2026-05", end: "2026-07" },
    highlights: [
      "Translated functional requirements into scalable, user-focused software solutions, reducing turnaround time by 10% across the development lifecycle.",
      "Optimised application performance and reliability by conducting targeted debugging and testing across core application features, identifying and resolving critical bugs that improved load time by 15%.",
    ],
    metrics: [
      { value: "10%", label: "Turnaround-time reduction", context: "Across the development lifecycle", source: "resume" },
      { value: "15%", label: "Load-time improvement", context: "From resolving critical bugs", source: "resume" },
    ],
    technologies: [],
  },
  {
    id: "zidio",
    role: "Data Science Intern",
    company: "Zidio Development",
    location: "Remote",
    period: { start: "2025-06", end: "2025-07" },
    highlights: [
      "Analysed datasets using SQL and Python, uncovering trends that informed decisions across 10 cross-functional teams.",
      "Built automated dashboards using Tableau, reducing manual reporting time by 15% and improving data accessibility for stakeholders.",
    ],
    metrics: [
      { value: "10", label: "Cross-functional teams", context: "Informed by data analysis", source: "resume" },
      { value: "15%", label: "Manual reporting-time reduction", context: "Via automated Tableau dashboards", source: "resume" },
    ],
    technologies: ["SQL", "Python", "Tableau"],
  },
];
