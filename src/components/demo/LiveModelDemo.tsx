"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { ArrowUpRight, Cpu, Loader2, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { engineInfo, runScenario, SMARTGRID_URL, type EngineInfo, type Fault, type ScenarioRun } from "@/lib/smartgrid";

const FAULTS: { id: Fault; label: string }[] = [
  { id: "thermal_runaway", label: "Thermal runaway" },
  { id: "load_oscillation", label: "Load oscillation" },
  { id: "intermittent_arcing", label: "Arcing" },
  { id: "sudden", label: "Sudden trip" },
  { id: "none", label: "No fault" },
];
const SEVERITIES = [0.5, 1, 1.5];
const W = 640, H = 200, PAD = { l: 34, r: 12, t: 14, b: 26 };

const dur = (min: number) => `${Math.floor(min / 60)}h ${String(Math.round(min % 60)).padStart(2, "0")}m`;

type State =
  | { kind: "idle" }
  | { kind: "running"; slow: boolean }
  | { kind: "done"; run: ScenarioRun; ms: number; seed: number; fault: Fault; severity: number }
  | { kind: "error"; message: string };

/**
 * Live demo of the SmartGrid AI model: the visitor injects a fault into a synthetic transformer stream and the
 * REAL engine (GRU + temporal attention, ONNX Runtime on Vercel) scores every 15-minute step. The curve, the
 * warning and the lead time are the engine's output; the browser only draws them.
 */
export function LiveModelDemo({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = usePrefersReducedMotion();
  const [fault, setFault] = useState<Fault>("thermal_runaway");
  const [severity, setSeverity] = useState(1);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [info, setInfo] = useState<EngineInfo | null>(null);
  const autoRan = useRef(false);

  const run = useCallback(async (f: Fault, s: number) => {
    const seed = Math.floor(Math.random() * 100000);
    setState({ kind: "running", slow: false });
    const slowTimer = setTimeout(() => setState((st) => (st.kind === "running" ? { kind: "running", slow: true } : st)), 2500);
    const t0 = performance.now();
    try {
      const [r, i] = await Promise.all([runScenario(f, s, seed), info ? Promise.resolve(info) : engineInfo()]);
      setInfo(i);
      setState({ kind: "done", run: r, ms: performance.now() - t0, seed, fault: f, severity: s });
    } catch (e) {
      setState({ kind: "error", message: (e as Error).name === "AbortError" ? "The engine took too long to respond." : (e as Error).message });
    } finally {
      clearTimeout(slowTimer);
    }
  }, [info]);

  // run once automatically when the demo scrolls into view, so it is never an empty box
  useEffect(() => {
    if (inView && !autoRan.current) { autoRan.current = true; run("thermal_runaway", 1); }
  }, [inView, run]);

  const done = state.kind === "done" ? state : null;
  const recs = done ? done.run.records.filter((r) => r.risk !== null || r.offline) : [];
  const trip = recs.find((r) => r.ground_truth?.failure_event);
  const lead = trip?.lead_time_min ?? null;
  const warnIdx = recs.findIndex((r) => r.status === "WARNING" || r.status === "CRITICAL");
  const onsetIdx = done?.run.session.incident?.onset_idx ?? null;
  const warnRisk = info?.thresholds.warning_risk ?? 0.0365;
  const peak = recs.reduce((m, r) => Math.max(m, r.risk ?? 0), 0);
  const scored = recs.filter((r) => r.risk !== null);
  const alarmEpisodes = recs.reduce((n, r, i) => n + ((r.status === "WARNING" || r.status === "CRITICAL") && !(i && (recs[i - 1].status === "WARNING" || recs[i - 1].status === "CRITICAL")) ? 1 : 0), 0);
  const atWarn = warnIdx >= 0 ? recs[warnIdx] : null;
  const topSignal = (atWarn ?? scored.at(-1))?.signals?.[0];

  // chart geometry: x = step, y = calibrated risk (0–100 %, sqrt scale so the low warning level stays visible)
  const n = Math.max(recs.length - 1, 1);
  const x = (i: number) => PAD.l + (i / n) * (W - PAD.l - PAD.r);
  const y = (risk: number) => PAD.t + (1 - Math.sqrt(Math.min(1, Math.max(0, risk)))) * (H - PAD.t - PAD.b);
  const path = recs.map((r, i) => (r.risk === null ? null : `${x(i).toFixed(1)},${y(r.risk).toFixed(1)}`))
    .reduce<string[]>((acc, p, i, all) => { if (p) acc.push(`${i === 0 || !all[i - 1] ? "M" : "L"}${p}`); return acc; }, []).join(" ");
  const idxOf = (rowIndex: number | null) => (rowIndex == null ? -1 : recs.findIndex((r) => r.index === rowIndex));
  const onsetX = onsetIdx != null && idxOf(onsetIdx) >= 0 ? x(idxOf(onsetIdx)) : null;
  const tripX = trip ? x(recs.indexOf(trip)) : null;
  const warnX = warnIdx >= 0 ? x(warnIdx) : null;

  return (
    <div ref={ref} className={cn("card overflow-hidden rounded-2xl", compact ? "p-4" : "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Live model · SmartGrid AI
        </div>
        <span className="font-mono text-[11px] text-muted">
          {info ? `${info.model.parameters.toLocaleString()}-param GRU + attention · ${info.engine?.runtime === "OnnxScorer" ? "ONNX Runtime" : "PyTorch"} on Vercel` : "GRU + temporal attention · ONNX Runtime"}
        </span>
      </div>

      {/* controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Fault to inject">
          {FAULTS.map((f) => (
            <button key={f.id} role="radio" aria-checked={fault === f.id} onClick={() => setFault(f.id)}
              className={cn("rounded-full border px-3 py-1 text-[12.5px] transition-colors",
                fault === f.id ? "border-accent bg-accent-soft text-fg" : "border-border text-muted hover:text-fg")}>
              {f.label}
            </button>
          ))}
        </div>
        <div className={cn("flex overflow-hidden rounded-full border border-border", (fault === "none" || fault === "sudden") && "opacity-40")} role="radiogroup" aria-label="Fault severity">
          {SEVERITIES.map((s) => (
            <button key={s} role="radio" aria-checked={severity === s} disabled={fault === "none" || fault === "sudden"} onClick={() => setSeverity(s)}
              className={cn("px-2.5 py-1 font-mono text-[12px]", severity === s ? "bg-fg text-bg" : "text-muted")}>{s}×</button>
          ))}
        </div>
        <button onClick={() => run(fault, severity)} disabled={state.kind === "running"}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-1.5 text-[13px] font-medium text-bg transition-opacity disabled:opacity-60">
          {state.kind === "running" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : state.kind === "done" ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {state.kind === "running" ? "Running…" : "Run on the live model"}
        </button>
      </div>

      {/* chart */}
      <div className="mt-4 rounded-xl border border-border bg-surface-2/40 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img"
          aria-label={done ? `Calibrated failure risk over ${recs.length} fifteen-minute steps` : "Risk chart (waiting for the model)"}>
          {[0, 0.05, 0.25, 0.5, 1].map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeWidth={0.6} />
              <text x={PAD.l - 6} y={y(v) + 3} textAnchor="end" fontSize={9} fill="var(--muted)" fontFamily="var(--font-mono)">{Math.round(v * 100)}%</text>
            </g>
          ))}
          <line x1={PAD.l} x2={W - PAD.r} y1={y(warnRisk)} y2={y(warnRisk)} stroke="var(--warning)" strokeDasharray="4 3" strokeWidth={1} />
          <text x={PAD.l + 4} y={y(warnRisk) - 4} fontSize={9} fill="var(--warning)" fontFamily="var(--font-mono)">warning threshold</text>
          {onsetX != null && <><line x1={onsetX} x2={onsetX} y1={PAD.t} y2={H - PAD.b} stroke="var(--muted)" strokeDasharray="2 3" />
            <text x={onsetX + 4} y={H - PAD.b - 4} fontSize={9} fill="var(--muted)" fontFamily="var(--font-mono)">fault injected</text></>}
          {warnX != null && <><line x1={warnX} x2={warnX} y1={PAD.t} y2={H - PAD.b} stroke="var(--warning)" />
            <text x={warnX - 4} y={PAD.t + 10} textAnchor="end" fontSize={9} fill="var(--warning)" fontFamily="var(--font-mono)">model warning</text></>}
          {tripX != null && <><line x1={tripX} x2={tripX} y1={PAD.t} y2={H - PAD.b} stroke="var(--danger)" strokeWidth={1.5} />
            <text x={tripX + 4} y={PAD.t + 22} textAnchor={tripX > W - 60 ? "end" : "start"} dx={tripX > W - 60 ? -8 : 0} fontSize={9} fill="var(--danger)" fontFamily="var(--font-mono)">trip</text></>}
          {path && <path key={`${done?.seed}`} d={path} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={reduced ? 0 : 1}
            style={reduced ? undefined : { animation: "sg-draw 1.6s ease-out forwards" }} />}
          {state.kind !== "done" && (
            <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={12} fill="var(--muted)">
              {state.kind === "running" ? (state.slow ? "Waking the serverless model (cold start)…" : "The model is scoring 96 fifteen-minute steps…")
                : state.kind === "error" ? "Could not reach the model." : "Press Run to score a scenario."}
            </text>
          )}
        </svg>
      </div>

      {/* result */}
      <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr]" aria-live="polite">
        <div>
          {state.kind === "error" && <p className="text-sm text-danger">{state.message} <button className="underline" onClick={() => run(fault, severity)}>Retry</button></p>}
          {done && (done.fault === "none" ? (
            <><div className="font-mono text-[11px] uppercase tracking-wider text-muted">Fault-free run</div>
              <div className="metric-number text-3xl font-semibold">{alarmEpisodes} false alarm{alarmEpisodes === 1 ? "" : "s"}</div></>
          ) : lead != null ? (
            <><div className="font-mono text-[11px] uppercase tracking-wider text-success">First reliable warning</div>
              <div className="metric-number text-3xl font-semibold">{dur(lead)} <span className="text-base font-medium text-muted">before the trip</span></div></>
          ) : (
            <><div className="font-mono text-[11px] uppercase tracking-wider text-warning">Outcome</div>
              <div className="text-2xl font-semibold">No reliable warning</div>
              <p className="text-xs text-muted">{done.fault === "sudden" ? "Sudden trips have no precursor — no sensor-based model can warn." : "Try a higher severity: weak faults are not always caught."}</p></>
          ))}
          {state.kind === "running" && <div className="h-12 w-48 animate-pulse rounded-lg bg-surface-2" />}
        </div>
        {done && (
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
            <dt className="text-muted">Engine compute</dt><dd className="font-mono">{done.run.compute_ms.toFixed(0)} ms · 96 steps</dd>
            <dt className="text-muted">Round trip</dt><dd className="font-mono">{done.ms.toFixed(0)} ms</dd>
            <dt className="text-muted">Peak risk</dt><dd className="font-mono">{(Math.min(peak, 0.99) * 100).toFixed(1)}%</dd>
            {topSignal && <><dt className="text-muted">Model relied on</dt><dd>{topSignal.signal} <span className="font-mono text-muted">{Math.round(topSignal.share * 100)}%</span></dd></>}
          </dl>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[11.5px] text-muted">
        <span className="inline-flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" aria-hidden />
          Synthetic transformer stream with a simulated fault{done ? ` · seed ${done.seed}` : ""}. Every number above is computed by the deployed model.</span>
        <a href={SMARTGRID_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
          Open the full Scenario Lab <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
