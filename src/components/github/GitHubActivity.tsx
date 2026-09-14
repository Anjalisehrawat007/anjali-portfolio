"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, GitFork, Link2, RefreshCw, Search, Star } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import type { GitHubPayload, GitHubRepo } from "@/lib/types";
import { profile } from "@/data/profile";
import { featuredProjects } from "@/data/projects";
import { repoProjectMap, snapshotDate, snapshotRepos } from "@/data/github";
import { cn, relativeTime } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

type State =
  | { status: "loading" }
  | { status: "live"; data: GitHubPayload }
  | { status: "fallback"; repos: GitHubRepo[]; reason: string }
  ;

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5", TypeScript: "#3178c6", JavaScript: "#f1e05a", HTML: "#e34c26", CSS: "#563d7c",
  Java: "#b07219", "C++": "#f34b7d", C: "#555555", Dart: "#00B4AB", Solidity: "#AA6746", "Jupyter Notebook": "#DA5B0B",
};

export function GitHubActivity() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [query, setQuery] = useState("");
  const [includeForks, setIncludeForks] = useState(false);
  const [sort, setSort] = useState<"pushed" | "stars">("pushed");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as GitHubPayload;
      })
      .then((data) => { if (!cancelled) setState({ status: "live", data }); })
      .catch((e: Error) => { if (!cancelled) setState({ status: "fallback", repos: snapshotRepos, reason: e.message }); });
    return () => { cancelled = true; };
  }, [attempt]);

  const repos = useMemo(
    () => (state.status === "live" ? state.data.repos : state.status === "fallback" ? state.repos : []),
    [state],
  );
  const retry = () => { setState({ status: "loading" }); setAttempt((a) => a + 1); };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos
      .filter((r) => includeForks || !r.fork)
      .filter((r) => !q || r.name.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q) || (r.language ?? "").toLowerCase().includes(q))
      .sort((a, b) => (sort === "stars" ? b.stars - a.stars || +new Date(b.pushedAt) - +new Date(a.pushedAt) : +new Date(b.pushedAt) - +new Date(a.pushedAt)));
  }, [repos, query, includeForks, sort]);

  const languages = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of repos.filter((r) => !r.fork && r.language)) m.set(r.language!, (m.get(r.language!) ?? 0) + 1);
    const total = Array.from(m.values()).reduce((a, b) => a + b, 0);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).map(([lang, n]) => ({ lang, n, pct: total ? (n / total) * 100 : 0 }));
  }, [repos]);

  const lastPush = repos.length ? repos.reduce((a, b) => (+new Date(b.pushedAt) > +new Date(a.pushedAt) ? b : a)) : null;

  return (
    <Section id="github" atmosphere="spot">
      <SectionHeading
        eyebrow="Engineering activity"
        title="Live from GitHub."
        description="Public repositories fetched from the GitHub API, cached hourly. Nothing here is hand-written — if the API is down, a dated snapshot of the same real data is shown."
        action={
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-icon-shift btn-icon-shift-up inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-fg shadow-card-sm transition-colors hover:border-border-strong hover:bg-surface-2">
            <Github className="h-4 w-4" /> @{profile.githubUser} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        }
      />

      {/* Status banner */}
      {state.status === "fallback" && (
        <div role="status" className="mb-6 flex flex-col gap-2 rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2 text-fg-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            Live GitHub data is unavailable right now ({state.reason}). Showing a snapshot from {snapshotDate}.
          </span>
          <button type="button" onClick={retry} className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-fg hover:underline">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Profile + languages + project links */}
        <div className="space-y-4">
          <div className="card relative overflow-hidden rounded-2xl p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent-soft to-transparent" aria-hidden />
            {state.status === "loading" ? (
              <div className="animate-pulse space-y-3" aria-busy>
                <div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-surface-2" /><div className="space-y-2"><div className="h-3 w-28 rounded bg-surface-2" /><div className="h-3 w-20 rounded bg-surface-2" /></div></div>
                <div className="grid grid-cols-3 gap-2 pt-2">{[0, 1, 2].map((i) => <div key={i} className="h-12 rounded-lg bg-surface-2" />)}</div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {state.status === "live" ? (
                    <Image src={state.data.profile.avatarUrl} alt="" width={48} height={48} className="h-12 w-12 rounded-full border border-border" unoptimized />
                  ) : (
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface-2"><Github className="h-5 w-5 text-muted" /></span>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-fg">{state.status === "live" ? state.data.profile.name ?? profile.fullName : profile.fullName}</div>
                    <div className="truncate text-xs text-muted">@{profile.githubUser}</div>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-border p-2"><dt className="font-mono text-[10px] uppercase text-muted">Repos</dt><dd className="text-lg font-semibold text-fg tabular-nums">{state.status === "live" ? state.data.profile.publicRepos : repos.length}</dd></div>
                  <div className="rounded-lg border border-border p-2"><dt className="font-mono text-[10px] uppercase text-muted">Own</dt><dd className="text-lg font-semibold text-fg tabular-nums">{repos.filter((r) => !r.fork).length}</dd></div>
                  <div className="rounded-lg border border-border p-2"><dt className="font-mono text-[10px] uppercase text-muted">Last push</dt><dd className="text-sm font-semibold text-fg">{lastPush ? relativeTime(lastPush.pushedAt) : "—"}</dd></div>
                </dl>
                {state.status === "live" && <p className="mt-3 font-mono text-[10px] text-muted">Fetched {relativeTime(state.data.fetchedAt)} · cached 1h</p>}
              </>
            )}
          </div>

          <div className="card rounded-2xl p-5">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Languages (own repos)</h3>
            {state.status === "loading" ? (
              <div className="mt-3 h-2 animate-pulse rounded-full bg-surface-2" />
            ) : languages.length === 0 ? (
              <p className="mt-2 text-xs text-muted">No language data available.</p>
            ) : (
              <>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={languages.map((l) => `${l.lang} ${Math.round(l.pct)}%`).join(", ")}>
                  {languages.map((l) => <span key={l.lang} style={{ width: `${l.pct}%`, background: LANG_COLORS[l.lang] ?? "var(--muted)" }} />)}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {languages.map((l) => (
                    <li key={l.lang} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-fg-2"><span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[l.lang] ?? "var(--muted)" }} />{l.lang}</span>
                      <span className="font-mono text-muted">{l.n} · {Math.round(l.pct)}%</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="card rounded-2xl p-5">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Portfolio → repository</h3>
            <ul className="mt-3 space-y-2">
              {featuredProjects.map((p) => {
                const repoName = Object.entries(repoProjectMap).find(([, slug]) => slug === p.slug)?.[0];
                const repo = repoName ? repos.find((r) => r.name === repoName) : undefined;
                return (
                  <li key={p.slug} className="flex items-center justify-between gap-2 text-sm">
                    <Link href={`/projects/${p.slug}`} className="truncate text-fg-2 hover:text-fg">{p.shortName}</Link>
                    {p.links.github ? (
                      <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-[150px] items-center gap-1 text-xs font-medium text-accent hover:underline"><Link2 className="h-3 w-3 shrink-0" /> <span className="truncate">{repo?.name ?? p.links.github.split("/").filter(Boolean).pop()}</span></a>
                    ) : (
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">coming soon</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Repository list */}
        <div className="card rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search repositories…"
                aria-label="Search repositories"
                className="h-9 w-full rounded-lg border border-border bg-bg pl-9 pr-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </label>
            <div className="flex items-center gap-2">
              <div role="group" aria-label="Sort" className="flex rounded-lg border border-border p-0.5">
                {(["pushed", "stars"] as const).map((s) => (
                  <button key={s} type="button" aria-pressed={sort === s} onClick={() => setSort(s)} className={cn("rounded-md px-2.5 py-1 text-xs font-medium transition-colors", sort === s ? "bg-fg text-bg" : "text-muted hover:text-fg")}>
                    {s === "pushed" ? "Recent" : "Stars"}
                  </button>
                ))}
              </div>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted">
                <input type="checkbox" checked={includeForks} onChange={(e) => setIncludeForks(e.target.checked)} className="accent-[var(--accent)]" /> Forks
              </label>
            </div>
          </div>

          {state.status === "loading" ? (
            <ul className="grid gap-3 p-3 sm:grid-cols-2" aria-busy>
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="animate-pulse rounded-xl border border-border p-4"><div className="h-3.5 w-1/3 rounded bg-surface-2" /><div className="mt-2 h-3 w-2/3 rounded bg-surface-2" /><div className="mt-4 h-3 w-1/2 rounded bg-surface-2" /></li>
              ))}
            </ul>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted">
              {repos.length === 0 ? "No public repositories found." : `No repositories match “${query}”.`}
            </div>
          ) : (
            <ul className="grid gap-3 p-3 sm:grid-cols-2">
              {filtered.map((r) => {
                const linked = repoProjectMap[r.name] ? featuredProjects.find((p) => p.slug === repoProjectMap[r.name]) : undefined;
                const color = LANG_COLORS[r.language ?? ""] ?? "var(--border-strong)";
                return (
                  <li key={r.fullName} className="card card-hover group relative flex flex-col overflow-hidden rounded-xl">
                    <span className="absolute inset-x-0 top-0 h-0.5 opacity-70" style={{ background: color }} aria-hidden />
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-3">
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="min-w-0 text-sm font-semibold text-fg after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                          <span className="block truncate">{r.name}</span>
                        </a>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {r.fork && <Badge tone="mono">fork</Badge>}
                          {linked && <Link href={`/projects/${linked.slug}`} className="relative z-10"><Badge tone="accent"><Link2 className="h-3 w-3" /> {linked.shortName}</Badge></Link>}
                        </div>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted">{r.description ?? <span className="italic">No description</span>}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-xs text-muted">
                        {r.language && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: color }} />{r.language}</span>}
                        <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {r.stars}</span>
                        <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {r.forks}</span>
                        <span>pushed {relativeTime(r.pushedAt)}</span>
                        <span className="ml-auto inline-flex items-center gap-1 font-medium text-fg-2 opacity-0 transition-opacity group-hover:opacity-100">
                          Open <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
