// Regenerates the offline snapshot of real public repositories in src/data/github.ts.
// Usage: npm run snapshot:github
import { readFileSync, writeFileSync } from "node:fs";

const USER = "Anjalisehrawat007";
const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&type=owner`, {
  headers: { Accept: "application/vnd.github+json", "User-Agent": "anjali-portfolio" },
});
if (!res.ok) throw new Error(`GitHub API ${res.status}`);
const repos = (await res.json())
  .filter((r) => !r.fork)
  .map((r) => ({
    name: r.name, fullName: r.full_name, url: r.html_url, description: r.description, language: r.language,
    stars: r.stargazers_count, forks: r.forks_count, fork: r.fork, pushedAt: r.pushed_at, updatedAt: r.updated_at, topics: r.topics ?? [],
  }));

const file = new URL("../src/data/github.ts", import.meta.url);
let src = readFileSync(file, "utf8");
const today = new Date().toISOString().slice(0, 10);
src = src.replace(/export const snapshotDate = "[^"]+";/, `export const snapshotDate = "${today}";`);
src = src.replace(
  /export const snapshotRepos: GitHubRepo\[\] = \[[\s\S]*?\n\];/,
  `export const snapshotRepos: GitHubRepo[] = [\n${repos.map((r) => `  ${JSON.stringify(r)},`).join("\n")}\n];`,
);
writeFileSync(file, src);
console.log(`Snapshot updated: ${repos.length} repositories (${today}).`);
