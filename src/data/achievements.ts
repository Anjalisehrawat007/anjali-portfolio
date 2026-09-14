import type { Achievement, Certification } from "@/lib/types";

/** Source of truth: resume ACHIEVEMENTS & INVOLVEMENTS / CERTIFICATIONS. */
export const achievements: Achievement[] = [
  {
    id: "viteee",
    title: "All India Rank 47",
    detail: "VIT Engineering Entrance Examination (VITEEE 2023)",
    period: "2023",
    highlight: "AIR 47",
  },
  {
    id: "vitmas",
    title: "Core Committee Member",
    detail: "Technical Team, VITMAS Club",
    period: "2024 – 2025",
  },
  {
    id: "ecell",
    title: "Core Team Member",
    detail: "Organised the E-Cell Inter-College Hackathon",
    period: "2023 – 2024",
    highlight: "500+ participants",
  },
];

export const certifications: Certification[] = [
  { id: "oracle", name: "Oracle Certified Foundation Associate", issuer: "Oracle", date: "2025-09" },
  { id: "ibm", name: "IBM Agentic AI Professional", issuer: "IBM", date: "2026-07" },
];
