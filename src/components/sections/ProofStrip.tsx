import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { achievements } from "@/data/achievements";

/** Above-the-fold evidence for a 10-second scan. Every item is derived from the typed data in src/data/. */
export function ProofStrip() {
  const demos = projects.filter((p) => p.links.demo).length;
  const latest = experience[0];
  const rank = achievements.find((a) => a.id === "viteee");
  const items = [
    { href: "#live-model", k: "Live", v: "Run a real ML model on this page", live: true },
    { href: "#projects", k: `${projects.length} systems`, v: `${demos} with live demos` },
    latest && { href: "#experience", k: latest.role, v: latest.company },
    { href: "#about", k: `CGPA ${profile.education.cgpa}`, v: `B.Tech CSE · ${profile.education.school.replace("Vellore Institute of Technology", "VIT")}` },
    rank && { href: "#achievements", k: rank.highlight ?? rank.title, v: `${rank.detail.match(/\(([^)]+)\)/)?.[1] ?? rank.detail} · All India` },
  ].filter(Boolean) as { href: string; k: string; v: string; live?: boolean }[];

  return (
    <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" aria-label="Highlights">
      {items.map((it) => (
        <li key={it.href}>
          <a href={it.href} className="card card-hover group flex h-full flex-col rounded-xl px-3.5 py-3 transition-colors">
            <span className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight text-fg">
              {it.live && (
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
              )}
              {it.k}
            </span>
            <span className="mt-0.5 flex items-center justify-between gap-1 text-[12.5px] text-muted">
              {it.v}<ArrowRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
