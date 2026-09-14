import type { GitHubPayload, GitHubRepo } from "./types";
import { profile } from "@/data/profile";

const API = "https://api.github.com";

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "anjali-portfolio",
  };
  // Optional: raises the rate limit from 60/h to 5000/h. Never exposed to the client.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

interface RawRepo {
  name: string; full_name: string; html_url: string; description: string | null; language: string | null;
  stargazers_count: number; forks_count: number; fork: boolean; pushed_at: string; updated_at: string; topics?: string[];
}
interface RawUser {
  login: string; name: string | null; html_url: string; avatar_url: string; public_repos: number; followers: number; created_at: string;
}

/** Fetches the public profile + repositories. Throws on any failure; callers decide the fallback. */
export async function fetchGitHub(): Promise<GitHubPayload> {
  const user = profile.githubUser;
  const [u, r] = await Promise.all([
    fetch(`${API}/users/${user}`, { headers: headers(), next: { revalidate: 3600 } }),
    fetch(`${API}/users/${user}/repos?per_page=100&sort=pushed&type=owner`, { headers: headers(), next: { revalidate: 3600 } }),
  ]);
  if (!u.ok || !r.ok) throw new Error(`GitHub API ${u.status}/${r.status}`);
  const rawUser = (await u.json()) as RawUser;
  const rawRepos = (await r.json()) as RawRepo[];

  const repos: GitHubRepo[] = rawRepos.map((x) => ({
    name: x.name,
    fullName: x.full_name,
    url: x.html_url,
    description: x.description,
    language: x.language,
    stars: x.stargazers_count,
    forks: x.forks_count,
    fork: x.fork,
    pushedAt: x.pushed_at,
    updatedAt: x.updated_at,
    topics: x.topics ?? [],
  }));

  return {
    profile: {
      login: rawUser.login,
      name: rawUser.name,
      url: rawUser.html_url,
      avatarUrl: rawUser.avatar_url,
      publicRepos: rawUser.public_repos,
      followers: rawUser.followers,
      createdAt: rawUser.created_at,
    },
    repos,
    fetchedAt: new Date().toISOString(),
  };
}
