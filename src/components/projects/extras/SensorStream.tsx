"use client";

import { useEffect, useRef, useState } from "react";
import { useMounted, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Illustrative multivariate stream → 12-hour sliding window → GRU + attention risk score.
 * The signal is synthetic (deterministic noise) — it is NOT project data.
 */
const CHANNELS = [
  { id: "load", label: "Useful load", color: "var(--muted)" },
  { id: "reactive", label: "Reactive load", color: "var(--fg-2)" },
  { id: "temperature", label: "Oil temperature", color: "var(--accent)" },
];
const W = 640, H = 160, N = 160;

function series(seed: number, t: number) {
  return Array.from({ length: N }, (_, i) => {
    const x = (i + t) / 10;
    return 0.5 + 0.22 * Math.sin(x + seed) + 0.12 * Math.sin(2.3 * x + seed * 3) + 0.06 * Math.sin(7.1 * x + seed * 7);
  });
}

export function SensorStream() {
  const reduced = usePrefersReducedMotion();
  // Paths are computed from Math.sin, whose last bits differ between Node and
  // browsers — render them only after mount to keep SSR/CSR markup identical.
  const mounted = useMounted();
  const [t, setT] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (reduced) return;
    let last = performance.now();
    const loop = (now: number) => {
      if (now - last > 40) { setT((x) => x + 1); last = now; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced]);

  const data = CHANNELS.map((c, i) => series(i + 1, t));
  const path = (ys: number[]) => ys.map((y, i) => `${i === 0 ? "M" : "L"} ${((i / (N - 1)) * W).toFixed(1)} ${(H - y * H).toFixed(1)}`).join(" ");
  const winStart = W * 0.7;
  // "Score" = illustrative: windowed mean of the temperature channel.
  const win = data[2].slice(Math.floor(N * 0.7));
  const score = win.reduce((a, b) => a + b, 0) / win.length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">Streaming inference (illustrative)</p>
          <p className="mt-1 text-sm text-fg-2">Channels arrive every 15 minutes; the GRU + attention model scores the latest 12-hour window. Synthetic signal — not project data. Try the real engine in the live demo.</p>
        </div>
        <div className="flex gap-3 text-[11px]">
          {CHANNELS.map((c) => <span key={c.id} className="flex items-center gap-1.5 text-muted"><span className="h-0.5 w-4" style={{ background: c.color }} />{c.label}</span>)}
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_140px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full rounded-lg border border-border bg-surface-2/50" role="img" aria-label="Illustrative multivariate sensor stream">
          <rect x={winStart} y={0} width={W - winStart} height={H} fill="var(--accent-soft)" />
          <line x1={winStart} x2={winStart} y1={0} y2={H} stroke="var(--accent)" strokeDasharray="3 3" />
          {mounted && data.map((ys, i) => <path key={i} d={path(ys)} fill="none" stroke={CHANNELS[i].color} strokeWidth={1.25} />)}
          <text x={winStart + 6} y={14} fontSize={10} fontFamily="var(--font-mono)" fill="var(--accent)">window</text>
        </svg>
        <div className="flex flex-col justify-between rounded-lg border border-border p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted">Model output</div>
          <div className="text-3xl font-semibold tabular-nums text-fg">{mounted ? score.toFixed(2) : "—"}</div>
          <div className="text-[11px] text-muted">risk score for the current window (illustrative)</div>
        </div>
      </div>
    </div>
  );
}
