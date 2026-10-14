/**
 * Client for the live SmartGrid AI engine (FastAPI on Vercel, ONNX Runtime).
 * The portfolio's origin is explicitly allowed by the engine's CORS policy.
 * Every value shown in the demo comes from this API — nothing is simulated in the browser.
 */
export const SMARTGRID_URL = "https://predictive-maintenance-power-grid.vercel.app";

export type Fault = "thermal_runaway" | "load_oscillation" | "intermittent_arcing" | "sudden" | "none";

export interface EngineRecord {
  index: number;
  timestamp: string;
  status: "WARMUP" | "NORMAL" | "WARNING" | "CRITICAL" | "OFFLINE";
  risk: number | null;
  confidence: number | null;
  offline: boolean;
  signals?: { signal: string; share: number }[];
  ground_truth?: { failure_event: number };
  lead_time_min?: number | null;
}

export interface ScenarioRun {
  records: EngineRecord[];
  events: { kind: string; message: string; index: number; lead_time_min?: number }[];
  compute_ms: number;
  attribution_method: string;
  session: { incident?: { onset_idx: number | null; failure_idx: number | null; failure_time: string | null } };
}

export interface EngineInfo {
  model: { type: string; parameters: number };
  thresholds: { warning_risk: number };
  engine?: { runtime: string; attribution: string };
}

async function call<T>(path: string, init?: RequestInit, timeoutMs = 30000): Promise<T> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetch(SMARTGRID_URL + path, { ...init, signal: ctl.signal, headers: { "Content-Type": "application/json" } });
    if (!r.ok) throw new Error(`engine returned ${r.status}`);
    return (await r.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export const engineInfo = () => call<EngineInfo>("/api/system");

export const runScenario = (fault: Fault, severity: number, seed: number) =>
  call<ScenarioRun>("/api/scenarios/run", {
    method: "POST",
    body: JSON.stringify({ asset: "ETTm2", month: 4, fault, severity, precursor_hours: 8, seed }),
  });
