"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { ArchNode, Architecture } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { NODE_KINDS } from "./nodeKinds";

interface Props {
  id: string;
  architecture: Architecture;
  node: ArchNode | null;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
  onSelect: (id: string) => void;
}

export function NodeDetail({ id, architecture, node, onClose, onNavigate, onSelect }: Props) {
  if (!node) {
    return (
      <div id={id} className="rounded-2xl border border-border bg-surface p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Architecture</p>
        <p className="mt-2 text-sm leading-relaxed text-fg-2">{architecture.summary}</p>
        <p className="mt-4 text-xs text-muted">
          Click any component to see what it does, why it exists, and the technology involved. Use ← → to move between components.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2">
          {Object.entries(NODE_KINDS)
            .filter(([k]) => architecture.nodes.some((n) => n.kind === k))
            .map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 text-xs text-fg-2">
                <v.icon className="h-3.5 w-3.5 text-muted" aria-hidden />
                {v.label}
              </div>
            ))}
        </div>
      </div>
    );
  }

  const kind = NODE_KINDS[node.kind];
  const upstream = architecture.edges.filter((e) => e.to === node.id).map((e) => architecture.nodes.find((n) => n.id === e.from)!);
  const downstream = architecture.edges.filter((e) => e.from === node.id).map((e) => architecture.nodes.find((n) => n.id === e.to)!);

  return (
    <div id={id} role="region" aria-live="polite" aria-label={`${node.label} details`} className="rounded-2xl border border-accent/40 bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent">
            <kind.icon className="h-3.5 w-3.5" aria-hidden />
            {kind.label} · Stage {node.stage + 1}: {architecture.stages[node.stage]}
          </p>
          <h4 className="mt-1.5 text-lg font-semibold tracking-tight text-fg">{node.label}</h4>
          {node.sublabel && <p className="text-sm text-muted">{node.sublabel}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <dl className="mt-4 space-y-4 text-sm">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">What it does</dt>
          <dd className="mt-1 leading-relaxed text-fg-2">{node.what}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Why it exists</dt>
          <dd className="mt-1 leading-relaxed text-fg-2">{node.why}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Technology</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {node.tech.length ? node.tech.map((t) => <Badge key={t} tone="accent">{t}</Badge>) : <span className="text-xs text-muted">Details coming soon</span>}
          </dd>
        </div>
        {(node.inputs?.length || node.outputs?.length) ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Inputs</dt>
              <dd className="mt-1 space-y-0.5 text-xs text-fg-2">
                {node.inputs?.length ? node.inputs.map((i) => <div key={i}>← {i}</div>) : <span className="text-muted">—</span>}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Outputs</dt>
              <dd className="mt-1 space-y-0.5 text-xs text-fg-2">
                {node.outputs?.length ? node.outputs.map((o) => <div key={o}>→ {o}</div>) : <span className="text-muted">—</span>}
              </dd>
            </div>
          </div>
        ) : null}
        {(upstream.length || downstream.length) ? (
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Connected components</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {upstream.map((n) => (
                <button key={n.id} type="button" onClick={() => onSelect(n.id)} className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs text-fg-2 transition-colors hover:border-accent hover:text-accent">
                  ← {n.label}
                </button>
              ))}
              {downstream.map((n) => (
                <button key={n.id} type="button" onClick={() => onSelect(n.id)} className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs text-fg-2 transition-colors hover:border-accent hover:text-accent">
                  {n.label} →
                </button>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
        <button type="button" onClick={() => onNavigate(-1)} className="inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-fg">
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </button>
        <button type="button" onClick={() => onNavigate(1)} className="inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-fg">
          Next <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
