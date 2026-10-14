import type { GitHubRepo } from "@/lib/types";

/**
 * GitHub configuration.
 *
 * `repoProjectMap` links a repository name → portfolio project slug so the
 * Engineering Activity section can say "Linked to: Sigil". It is empty until
 * the project repositories are public — add entries like:
 *   "sigil": "sigil",
 */
export const repoProjectMap: Record<string, string> = {
  "predictive-maintainance-for-power-grid": "power-grid-failure-prediction",
  "shoulder-rom-app": "shouldermotion-ai",
  rarecare: "rarecare",
};

/**
 * Snapshot of real public repositories, used only when the live GitHub API is
 * unreachable. Captured from api.github.com on 2026-09-14. Not fabricated —
 * update by running `npm run snapshot:github`.
 */
export const snapshotDate = "2026-09-14";
export const snapshotRepos: GitHubRepo[] = [
  { name: "trustmesh", fullName: "Anjalisehrawat007/trustmesh", url: "https://github.com/Anjalisehrawat007/trustmesh", description: null, language: null, stars: 0, forks: 0, fork: false, pushedAt: "2026-09-06T00:00:00Z", updatedAt: "2026-09-06T00:00:00Z", topics: [] },
  { name: "ATTEST-FL", fullName: "Anjalisehrawat007/ATTEST-FL", url: "https://github.com/Anjalisehrawat007/ATTEST-FL", description: null, language: "Python", stars: 0, forks: 1, fork: false, pushedAt: "2026-07-31T00:00:00Z", updatedAt: "2026-07-31T00:00:00Z", topics: [] },
  { name: "Transformer-Based-NLP-Fine-Tuned-DistilBERT-Sentiment-Analyzer", fullName: "Anjalisehrawat007/Transformer-Based-NLP-Fine-Tuned-DistilBERT-Sentiment-Analyzer", url: "https://github.com/Anjalisehrawat007/Transformer-Based-NLP-Fine-Tuned-DistilBERT-Sentiment-Analyzer", description: null, language: "Python", stars: 0, forks: 0, fork: false, pushedAt: "2026-07-06T00:00:00Z", updatedAt: "2026-07-06T00:00:00Z", topics: [] },
  { name: "WDS", fullName: "Anjalisehrawat007/WDS", url: "https://github.com/Anjalisehrawat007/WDS", description: null, language: null, stars: 0, forks: 0, fork: false, pushedAt: "2026-07-02T00:00:00Z", updatedAt: "2026-07-02T00:00:00Z", topics: [] },
  { name: "devcoch", fullName: "Anjalisehrawat007/devcoch", url: "https://github.com/Anjalisehrawat007/devcoch", description: null, language: "JavaScript", stars: 0, forks: 0, fork: false, pushedAt: "2026-07-02T00:00:00Z", updatedAt: "2026-07-02T00:00:00Z", topics: [] },
  { name: "collabcode-", fullName: "Anjalisehrawat007/collabcode-", url: "https://github.com/Anjalisehrawat007/collabcode-", description: null, language: "JavaScript", stars: 0, forks: 0, fork: false, pushedAt: "2026-06-05T00:00:00Z", updatedAt: "2026-06-05T00:00:00Z", topics: [] },
  { name: "End-to-End-ML-Pipeline-Churn-Prediction-", fullName: "Anjalisehrawat007/End-to-End-ML-Pipeline-Churn-Prediction-", url: "https://github.com/Anjalisehrawat007/End-to-End-ML-Pipeline-Churn-Prediction-", description: null, language: "Python", stars: 0, forks: 0, fork: false, pushedAt: "2026-06-05T00:00:00Z", updatedAt: "2026-06-05T00:00:00Z", topics: [] },
  { name: "Blog-CMS", fullName: "Anjalisehrawat007/Blog-CMS", url: "https://github.com/Anjalisehrawat007/Blog-CMS", description: null, language: "JavaScript", stars: 0, forks: 0, fork: false, pushedAt: "2026-06-05T00:00:00Z", updatedAt: "2026-06-05T00:00:00Z", topics: [] },
  { name: "water-project", fullName: "Anjalisehrawat007/water-project", url: "https://github.com/Anjalisehrawat007/water-project", description: null, language: "TypeScript", stars: 0, forks: 0, fork: false, pushedAt: "2026-05-17T00:00:00Z", updatedAt: "2026-05-17T00:00:00Z", topics: [] },
  { name: "portfolio", fullName: "Anjalisehrawat007/portfolio", url: "https://github.com/Anjalisehrawat007/portfolio", description: null, language: "HTML", stars: 0, forks: 0, fork: false, pushedAt: "2025-09-05T00:00:00Z", updatedAt: "2025-09-05T00:00:00Z", topics: [] },
];
