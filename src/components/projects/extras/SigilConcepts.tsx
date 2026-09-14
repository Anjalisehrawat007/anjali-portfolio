"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Lock, ShieldCheck, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Conceptual, in-browser illustrations of three Sigil mechanisms.
 * These demonstrate the *ideas* (real SHA-256 via Web Crypto for the Merkle
 * tree) — they are not the project's production implementation.
 */

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
const short = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;

/* ---------------- Merkle batch verification ---------------- */
const LEAVES = ["cred:alice:degree", "cred:bob:license", "cred:carol:employment", "cred:dave:membership"];

function MerkleDemo() {
  const [hashes, setHashes] = useState<string[] | null>(null);
  const [selected, setSelected] = useState(0);
  const [tampered, setTampered] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const leaves = await Promise.all(LEAVES.map((l, i) => sha256(tampered && i === selected ? l + "!" : l)));
      const l01 = await sha256(leaves[0] + leaves[1]);
      const l23 = await sha256(leaves[2] + leaves[3]);
      const root = await sha256(l01 + l23);
      if (live) setHashes([...leaves, l01, l23, root]);
    })();
    return () => { live = false; };
  }, [tampered, selected]);

  const [committedRoot, setCommittedRoot] = useState<string | null>(null);
  useEffect(() => {
    // Commit the honest root once.
    (async () => {
      const leaves = await Promise.all(LEAVES.map((l) => sha256(l)));
      const l01 = await sha256(leaves[0] + leaves[1]);
      const l23 = await sha256(leaves[2] + leaves[3]);
      setCommittedRoot(await sha256(l01 + l23));
    })();
  }, []);

  const sibling = selected ^ 1;
  const parent = selected < 2 ? 4 : 5;
  const uncle = selected < 2 ? 5 : 4;
  const valid = hashes && committedRoot ? hashes[6] === committedRoot : null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">Merkle-root batch verification</p>
          <p className="mt-1 text-sm text-fg-2">Four credentials, one on-chain root. Pick a credential to see its inclusion proof (highlighted), then tamper with it.</p>
        </div>
        <ShieldCheck className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2 font-mono text-[11px]">
          {/* root */}
          <Row label="root (on-chain)" hash={hashes?.[6]} tone={valid === false ? "bad" : "root"} />
          <div className="grid grid-cols-2 gap-2">
            <Row label="h(0,1)" hash={hashes?.[4]} tone={parent === 4 ? "path" : uncle === 4 ? "proof" : "idle"} />
            <Row label="h(2,3)" hash={hashes?.[5]} tone={parent === 5 ? "path" : uncle === 5 ? "proof" : "idle"} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {LEAVES.map((l, i) => (
              <button key={l} type="button" onClick={() => { setSelected(i); setTampered(false); }} className="text-left focus-visible:outline-none">
                <Row label={l.split(":")[1]} hash={hashes?.[i]} tone={i === selected ? "path" : i === sibling ? "proof" : "idle"} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:w-44">
          <button type="button" onClick={() => setTampered((t) => !t)} className={cn("rounded-lg border px-3 py-2 text-xs font-medium transition-colors", tampered ? "border-warning bg-warning/10 text-warning" : "border-border text-fg-2 hover:border-border-strong")}>
            {tampered ? "Restore credential" : "Tamper with credential"}
          </button>
          <div className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium", valid === null ? "border-border text-muted" : valid ? "border-success/40 bg-success/10 text-success" : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400")}>
            {valid === null ? "Hashing…" : valid ? <><Check className="h-3.5 w-3.5" /> Root matches chain</> : <><X className="h-3.5 w-3.5" /> Root mismatch</>}
          </div>
          <p className="text-[11px] leading-snug text-muted">Proof size: 2 hashes for 4 leaves — log₂(n). Real SHA-256 via Web Crypto.</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, hash, tone }: { label: string; hash?: string; tone: "root" | "path" | "proof" | "idle" | "bad" }) {
  return (
    <div className={cn(
      "rounded-md border px-2 py-1.5 transition-colors",
      tone === "root" && "border-accent bg-accent-soft",
      tone === "path" && "border-accent",
      tone === "proof" && "border-dashed border-accent/60",
      tone === "idle" && "border-border",
      tone === "bad" && "border-red-500/60 bg-red-500/10",
    )}>
      <div className="truncate text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className="truncate text-fg-2">{hash ? short(hash) : "…"}</div>
    </div>
  );
}

/* ---------------- M-of-N guardian recovery ---------------- */
function GuardianDemo() {
  const [n, setN] = useState(5);
  const [m, setM] = useState(3);
  const [approved, setApproved] = useState<Set<number>>(new Set());
  const changeN = (v: number) => { setN(v); setM((cur) => Math.min(cur, v)); setApproved(new Set()); };
  const changeM = (v: number) => { setM(v); setApproved(new Set()); };
  const unlocked = approved.size >= m;
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">M-of-N guardian recovery</p>
          <p className="mt-1 text-sm text-fg-2">Recovery needs approvals from any M of N guardians — no single guardian, and no central authority, can act alone.</p>
        </div>
        <Users className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">N guardians <input type="range" min={2} max={7} value={n} onChange={(e) => changeN(+e.target.value)} className="accent-[var(--accent)]" /> <span className="font-mono">{n}</span></label>
        <label className="flex items-center gap-2">M required <input type="range" min={1} max={n} value={m} onChange={(e) => changeM(+e.target.value)} className="accent-[var(--accent)]" /> <span className="font-mono">{m}</span></label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: n }).map((_, i) => {
          const on = approved.has(i);
          return (
            <button key={i} type="button" aria-pressed={on} onClick={() => setApproved((s) => { const c = new Set(s); if (c.has(i)) c.delete(i); else c.add(i); return c; })}
              className={cn("rounded-lg border px-3 py-2 text-xs font-medium transition-colors", on ? "border-accent bg-accent text-accent-fg" : "border-border text-fg-2 hover:border-border-strong")}>
              Guardian {i + 1}{on ? " ✓" : ""}
            </button>
          );
        })}
      </div>
      <div className={cn("mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium", unlocked ? "border-success/40 bg-success/10 text-success" : "border-border text-muted")}>
        <Lock className="h-4 w-4" /> {unlocked ? "Threshold met — access restored" : `${approved.size} / ${m} approvals`}
      </div>
    </div>
  );
}

/* ---------------- Zero-knowledge age proof ---------------- */
function ZkDemo() {
  const [year, setYear] = useState(2001);
  const [threshold, setThreshold] = useState(18);
  const [mode, setMode] = useState<"disclose" | "zk">("zk");
  const age = useMemo(() => new Date().getFullYear() - year, [year]);
  const over = age >= threshold;
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">Zero-knowledge age proof</p>
          <p className="mt-1 text-sm text-fg-2">A verifier needs “over {threshold}?”, not the birth year. Compare what each disclosure mode reveals.</p>
        </div>
        <Lock className="h-5 w-5 shrink-0 text-muted" aria-hidden />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">Birth year <input type="range" min={1980} max={2015} value={year} onChange={(e) => setYear(+e.target.value)} className="accent-[var(--accent)]" /> <span className="font-mono">{year}</span></label>
        <label className="flex items-center gap-2">Threshold <input type="range" min={13} max={25} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="accent-[var(--accent)]" /> <span className="font-mono">{threshold}</span></label>
        <div role="group" aria-label="Disclosure mode" className="flex rounded-lg border border-border p-0.5">
          {(["disclose", "zk"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} className={cn("rounded-md px-2.5 py-1 text-xs font-medium", mode === k ? "bg-fg text-bg" : "text-muted hover:text-fg")}>
              {k === "disclose" ? "Full disclosure" : "ZK proof"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-3 text-xs">
          <div className="font-mono uppercase tracking-wider text-muted">Holder knows</div>
          <div className="mt-1 text-fg-2">birth year = <span className="font-mono">{year}</span> · age = <span className="font-mono">{age}</span></div>
        </div>
        <div className={cn("rounded-lg border p-3 text-xs", mode === "zk" ? "border-accent/50 bg-accent-soft" : "border-warning/50 bg-warning/5")}>
          <div className="font-mono uppercase tracking-wider text-muted">Verifier learns</div>
          <div className="mt-1 text-fg-2">
            {mode === "zk"
              ? <>age ≥ {threshold}: <span className="font-mono font-semibold">{String(over)}</span> — and nothing else</>
              : <>birth year = <span className="font-mono">{year}</span>, age = <span className="font-mono">{age}</span>, ≥ {threshold}: <span className="font-mono">{String(over)}</span></>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SigilConcepts() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">
        Conceptual illustrations of the mechanisms Sigil uses. They run in your browser to show the idea; they are not the project’s production code.
      </p>
      <MerkleDemo />
      <div className="grid gap-4 lg:grid-cols-2">
        <GuardianDemo />
        <ZkDemo />
      </div>
    </div>
  );
}
