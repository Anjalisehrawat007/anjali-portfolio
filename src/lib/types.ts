/**
 * Structured data model for the portfolio.
 *
 * Everything rendered on the site derives from typed data in `src/data`.
 * Adding a project, metric, link or screenshot means editing data — not UI.
 */

export type ProjectStatus = "ongoing" | "completed";

export type Category =
  | "AI/ML"
  | "Full Stack"
  | "Computer Vision"
  | "NLP"
  | "Deep Learning"
  | "Web3"
  | "Security"
  | "Healthcare";

export interface Metric {
  value: string;
  label: string;
  /** Short qualifier shown under the label. */
  context?: string;
  /** Where the number comes from: the resume, or the project's own measured evaluation. */
  source: "resume" | "project";
}

export type NodeKind =
  | "input"
  | "model"
  | "process"
  | "storage"
  | "chain"
  | "security"
  | "output"
  | "infra";

export interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  kind: NodeKind;
  /** Zero-based layer. Nodes in the same stage render side by side. */
  stage: number;
  tech: string[];
  what: string;
  why: string;
  inputs?: string[];
  outputs?: string[];
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  /** Dashed edges denote a conceptual/secondary path. */
  dashed?: boolean;
}

export interface Architecture {
  summary: string;
  stages: string[];
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export interface ProjectLinks {
  /** Live deployment. `null` renders "Demo coming soon". */
  demo: string | null;
  /** Source repository. `null` renders "Repository coming soon". */
  github: string | null;
  /** Optional model/space link (e.g. Hugging Face). */
  huggingface?: string | null;
}

export interface ProjectMedia {
  screenshots: { src: string; alt: string }[];
  video: string | null;
  architectureImage: string | null;
}

export interface Project {
  slug: string;
  name: string;
  /** Short display name for nav/cards. */
  shortName: string;
  tagline: string;
  period: { start: string; end: string | null };
  status: ProjectStatus;
  featured: boolean;
  /** Lower renders first. */
  order: number;
  categories: Category[];
  technologies: string[];
  overview: string;
  problem: string;
  solution: string;
  /** What was implemented, as stated in source material. */
  implementation: string[];
  /** Design considerations implied by the stated architecture. */
  challenges: string[];
  metrics: Metric[];
  architecture: Architecture;
  links: ProjectLinks;
  media: ProjectMedia;
  /** Long-form README / write-up (markdown or plain). `null` → "Details coming soon". */
  readme: string | null;
  /** Explicit scope boundaries so the site never over-claims. */
  scopeNotes: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: { start: string; end: string | null };
  highlights: string[];
  metrics: Metric[];
  technologies: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  period?: string;
  highlight?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface GitHubRepo {
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  fork: boolean;
  pushedAt: string;
  updatedAt: string;
  topics: string[];
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  url: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  createdAt: string;
}

export interface GitHubPayload {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  fetchedAt: string;
}
