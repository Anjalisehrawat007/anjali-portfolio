import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.fullName} — Software Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0a0a0a", color: "#fafafa", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#9a9a9a" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "#fafafa", color: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>A</div>
          {profile.fullName} · Software Developer
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{profile.headline}</div>
          <div style={{ fontSize: 28, color: "#9a9a9a" }}>AI/ML + Full-Stack · BioBERT · CNN · GRU + Attention · MediaPipe · Next.js · Ethereum</div>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 22, color: "#8b8cf8" }}>
          <span>RareCare</span><span>Sigil</span><span>ShoulderMotion AI</span><span>Power Grid Failure Prediction</span>
        </div>
      </div>
    ),
    size,
  );
}
