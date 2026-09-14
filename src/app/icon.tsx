import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#fff", borderRadius: 14, fontSize: 38, fontWeight: 700, fontFamily: "monospace" }}>
        A
      </div>
    ),
    size,
  );
}
