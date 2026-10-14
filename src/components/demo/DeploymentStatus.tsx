"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { RefreshCw } from "lucide-react";
import { projects } from "@/data/projects";
import { SMARTGRID_URL } from "@/lib/smartgrid";
import { cn } from "@/lib/utils";

type Probe = { state: "checking" } | { state: "up"; ms: number; detail: string } | { state: "down" };

/**
 * Production status of every deployed demo, measured from the visitor's own browser right now.
 * The SmartGrid engine exposes a CORS-enabled readiness endpoint (model loaded?); other sites are checked for
 * reachability only (an opaque request: we can time it but not read it), and are labelled accordingly.
 */
export function DeploymentStatus() {
  const deployed = projects.filter((p) => p.links.demo);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [probes, setProbes] = useState<Record<string, Probe>>({});
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  const check = useCallback(async () => {
    setProbes(Object.fromEntries(deployed.map((p) => [p.slug, { state: "checking" } as Probe])));
    await Promise.all(deployed.map(async (p) => {
      const url = p.links.demo!;
      const t0 = performance.now();
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 15000);
      let probe: Probe;
      try {
        if (url.startsWith(SMARTGRID_URL)) {
          const r = await fetch(`${SMARTGRID_URL}/api/ready`, { cache: "no-store", signal: ctl.signal });
          const j = await r.json();
          probe = r.ok && j.ready ? { state: "up", ms: performance.now() - t0, detail: "API ready · model loaded" } : { state: "down" };
        } else {
          await fetch(url, { mode: "no-cors", cache: "no-store", signal: ctl.signal });
          probe = { state: "up", ms: performance.now() - t0, detail: "reachable" };
        }
      } catch {
        probe = { state: "down" };
      } finally {
        clearTimeout(timer);
      }
      setProbes((s) => ({ ...s, [p.slug]: probe }));
    }));
    setCheckedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }, [deployed]);

  // first check once the panel scrolls into view (deferred so the effect itself does not set state)
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(check, 0);
    return () => clearTimeout(id);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className="card mt-6 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-wider text-accent">Production deployments</h3>
          <p className="mt-1 text-sm text-muted">Checked live from your browser{checkedAt ? ` at ${checkedAt}` : ""} — not a hard-coded badge.</p>
        </div>
        <button onClick={check} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[12.5px] text-muted transition-colors hover:text-fg">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Re-check
        </button>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3" aria-live="polite">
        {deployed.map((p) => {
          const pr = probes[p.slug];
          return (
            <li key={p.slug}>
              <a href={p.links.demo!} target="_blank" rel="noopener noreferrer" className="card-hover flex h-full flex-col rounded-xl border border-border px-3.5 py-3">
                <span className="flex items-center gap-2 text-[14px] font-medium text-fg">
                  <span className={cn("h-2 w-2 rounded-full",
                    !pr || pr.state === "checking" ? "animate-pulse bg-muted" : pr.state === "up" ? "bg-success" : "bg-danger")} aria-hidden />
                  {p.shortName}
                </span>
                <span className="mt-1 font-mono text-[11.5px] text-muted">
                  {!pr || pr.state === "checking" ? "checking…" : pr.state === "up" ? `${pr.detail} · ${Math.round(pr.ms)} ms` : "not reachable right now"}
                </span>
                <span className="mt-1 truncate text-[11px] text-muted/80">{new URL(p.links.demo!).host}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
