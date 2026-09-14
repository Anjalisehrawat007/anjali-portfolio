# Anjali Sehrawat — Portfolio

A production-quality developer portfolio built as a software project: data-driven, interactive, accessible, and honest about its sources.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lucide

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes static; GitHub route revalidates hourly)
npm run lint
npm run typecheck
```

## Source-of-truth rule

Everything shown on the site is derived from typed data in `src/data/` — which in turn is taken from the resume (`public/Anjali_Sehrawat_Resume.pdf`). Nothing is fabricated: no metrics, repositories, demos, users or clinical claims beyond what the resume states. Where detail is unavailable, the UI renders **"Details coming soon"** / **"Demo coming soon"** / **"Repository coming soon"**.

| File | Contains |
|---|---|
| `src/data/profile.ts` | Name, headline, contact, education, about |
| `src/data/projects.ts` | The four featured projects, incl. interactive architecture specs |
| `src/data/experience.ts` | Roles + resume metrics |
| `src/data/skills.ts` | Skill groups; tech ↔ project relationships are *derived* from project data |
| `src/data/achievements.ts` | Achievements and certifications |
| `src/data/philosophy.ts` | Engineering themes, each citing evidence on the site |
| `src/data/github.ts` | Repo → project mapping + dated offline snapshot of real repos |

## Adding things later (no UI changes needed)

- **Live demo / GitHub repo:** set `links.demo` / `links.github` on the project in `src/data/projects.ts`. Buttons switch from "coming soon" to live automatically.
- **Screenshots / video / architecture image:** fill `media.screenshots`, `media.video`, `media.architectureImage` (put files in `public/`).
- **Metrics:** append to `metrics` (only real numbers).
- **Long write-up:** set `readme`.
- **New project:** append an object to `projects` — cards, filters, case-study route, sitemap, tech graph and skill relationships all pick it up.
- **Link a GitHub repo to a project in the activity feed:** add `"repo-name": "project-slug"` to `repoProjectMap` in `src/data/github.ts`.

## GitHub integration

`/api/github` proxies the GitHub REST API server-side, caches for an hour, and never exposes a token. On failure it returns `503` and the client shows a dated snapshot of the same real repositories with a Retry button — never a broken UI.

- Optional `GITHUB_TOKEN` in `.env.local` raises the rate limit (see `.env.example`).
- Refresh the offline snapshot with `npm run snapshot:github`.

## Architecture engine

`src/components/architecture/` renders any `Architecture` spec as a layered, interactive system diagram: stages become rows, edges are drawn from real DOM geometry (so it is fully responsive), nodes are keyboard-navigable buttons, and a detail panel explains **what / why / technology / inputs / outputs** for each component. Data-flow animation respects `prefers-reduced-motion`. The same edge engine powers the hero pipeline and the technology ↔ project graph.

Project-specific interactive extras live in `src/components/projects/extras/` (e.g. Sigil's Merkle-proof, M-of-N recovery and ZK-age-proof illustrations — clearly labelled as conceptual, not the production code).

## Deploy

Works on Vercel out of the box. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin for absolute Open Graph URLs and the sitemap.
