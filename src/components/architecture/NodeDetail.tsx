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

const Label = ({ children }: { children: React.ReactNode }) => (
  <dt className="mb-1.5 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
    <span className="h-px w-3 bg-border-strong" aria-hidden />{children}
  </dt>
);

export function NodeDetail({ id, architecture, node, onClose, onNavigate, onSelect }: Props) {
  if (!node) {
    return (
      <div id={id} className="card relative overflow-hidden rounded-2xl p-5">
        <div className="bg-spot pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Architecture</p>
          <p className="mt-2 text-sm leading-relaxed text-fg-2">{architecture.summary}</p>
          <p className="mt-4 text-xs text-muted">
            Click any component to see what it does, why it exists, and the technology involved. Use ← → to move between components.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2">
            {Object.entries(NODE_KINDS)
              .filter(([k]) => architecture.nodes.some((n) => n.kind === k))
              .map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-xs text-fg-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-surface-2"><v.icon className="h-3.5 w-3.5 text-muted" aria-hidden /></span>
                  {v.label}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  const kind = NODE_KINDS[node.kind];
  const upstream = architecture.edges.filter((e) => e.to === node.id).map((e) => architecture.nodes.find((n) => n.id === e.from)!);
  const downstream = architecture.edges.filter((e) => e.from === node.id).map((e) => architecture.nodes.find((n) => n.id === e.to)!);

  return (
    <div id={id} role="region" aria-live="polite" aria-label={`${node.label} details`} className="card card-active relative overflow-hidden rounded-2xl">
      {/* Header band */}
      <div className="relative border-b border-border bg-gradient-to-br from-accent-soft to-transparent px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
              <span className="grid h-5 w-5 place-items-center rounded bg-accent text-accent-fg"><kind.icon className="h-3 w-3" aria-hidden /></span>
              {kind.label} · Stage {node.stage + 1} — {architecture.stages[node.stage]}
            </p>
            <h4 className="mt-2 text-lg font-semibold tracking-tight text-fg">{node.label}</h4>
            {node.sublabel && <p className="text-sm text-muted">{node.sublabel}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close details" className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <dl className="space-y-4 px-5 py-4 text-sm">
        <div>
          <Label>What it does</Label>
          <dd className="leading-relaxed text-fg-2">{node.what}</dd>
        </div>
        <div>
          <Label>Why it exists</Label>
          <dd className="leading-relaxed text-fg-2">{node.why}</dd>
        </div>
        <div>
          <Label>Technology</Label>
          <dd className="flex flex-wrap gap-1.5">
            {node.tech.length ? node.tech.map((t) => <Badge key={t} tone="accent">{t}</Badge>) : <span className="text-xs text-muted">Details coming soon</span>}
          </dd>
        </div>
        {(node.inputs?.length || node.outputs?.length) ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-surface-2/60 p-2.5">
              <Label>Inputs</Label>
              <dd className="space-y-1 text-xs text-fg-2">
                {node.inputs?.length ? node.inputs.map((i) => <div key={i} className="flex gap-1.5"><span className="text-accent-2">←</span>{i}</div>) : <span className="text-muted">—</span>}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-surface-2/60 p-2.5">
              <Label>Outputs</Label>
              <dd className="space-y-1 text-xs text-fg-2">
                {node.outputs?.length ? node.outputs.map((o) => <div key={o} className="flex gap-1.5"><span className="text-accent">→</span>{o}</div>) : <span className="text-muted">—</span>}
              </dd>
            </div>
          </div>
        ) : null}
        {(upstream.length || downstream.length) ? (
          <div>
            <Label>Connected components</Label>
            <dd className="flex flex-wrap gap-1.5">
              {upstream.map((n) => (
                <button key={n.id} type="button" onClick={() => onSelect(n.id)} className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs text-fg-2 transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent">
                  ← {n.label}
                </button>
              ))}
              {downstream.map((n) => (
                <button key={n.id} type="button" onClick={() => onSelect(n.id)} className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs text-fg-2 transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent">
                  {n.label} →
                </button>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <button type="button" onClick={() => onNavigate(-1)} className="inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-fg">
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </button>
        <button type="button" onClick={() => onNavigate(1)} className="btn-icon-shift inline-flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-fg">
          Next <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
