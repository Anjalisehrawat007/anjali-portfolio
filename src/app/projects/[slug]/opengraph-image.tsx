import { ImageResponse } from "next/og";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** Per-project link preview (LinkedIn, Slack, email): name, tagline, headline metric and stack — from the data only. */
export default async function ProjectOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  const metric = p?.metrics[0];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#0a0a0a", color: "#fafafa", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#9a9a9a" }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: "#fafafa", color: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>A</div>
          {profile.fullName} · Case study
          {p?.links.demo ? <span style={{ marginLeft: 12, padding: "4px 12px", borderRadius: 999, border: "1px solid #4ade80", color: "#4ade80", fontSize: 20 }}>● Live demo</span> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{p?.name ?? "Project"}</div>
          <div style={{ fontSize: 26, color: "#b4b4b4", lineHeight: 1.35 }}>{p?.tagline}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 760 }}>
            {(p?.technologies ?? []).slice(0, 6).map((t) => (
              <span key={t} style={{ padding: "6px 14px", borderRadius: 999, background: "#1a1a22", color: "#a5a6ff", fontSize: 20 }}>{t}</span>
            ))}
          </div>
          {metric ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontSize: 56, fontWeight: 700, color: "#8f8ff9" }}>{metric.value}</div>
              <div style={{ fontSize: 20, color: "#9a9a9a" }}>{metric.label}</div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
