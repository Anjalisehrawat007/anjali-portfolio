"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Copy, CornerDownLeft, Download, FileText, Hash, Layers, Moon, Play, Search } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useTheme } from "./ThemeProvider";

export const OPEN_EVENT = "cmdk:open";
/** Open the palette from anywhere (e.g. the navbar button). */
export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

type Action = { type: "href"; href: string } | { type: "copy-email" } | { type: "download" } | { type: "theme" };
interface Item { id: string; group: string; label: string; hint?: string; keywords?: string; icon: ReactNode; action: Action }

const SECTIONS: [string, string][] = [
  ["home", "Home"], ["projects", "Projects"], ["live-model", "Live model demo"], ["experience", "Experience"],
  ["skills", "Skills"], ["github", "GitHub activity"], ["achievements", "Achievements"], ["about", "About"], ["contact", "Contact"],
];

/** Static command list, derived from the typed data in src/data/. */
function buildItems(): Item[] {
  const ic = "h-4 w-4";
  const out: Item[] = SECTIONS.map(([id, label]) => ({
    id: `s-${id}`, group: "Navigate", label, icon: id === "live-model" ? <Play className={ic} /> : <Hash className={ic} />,
    action: { type: "href", href: `#${id}` },
  }));
  for (const p of projects) {
    out.push({ id: `p-${p.slug}`, group: "Projects", label: `${p.shortName} — case study`, keywords: `${p.name} ${p.technologies.join(" ")}`,
      icon: <Layers className={ic} />, action: { type: "href", href: `/projects/${p.slug}` } });
    if (p.links.demo) out.push({ id: `d-${p.slug}`, group: "Live demos", label: `${p.shortName} — live demo`, hint: new URL(p.links.demo).host,
      keywords: p.name, icon: <ArrowUpRight className={ic} />, action: { type: "href", href: p.links.demo } });
    if (p.links.github) out.push({ id: `g-${p.slug}`, group: "Source code", label: `${p.shortName} — repository`, hint: "GitHub",
      keywords: p.name, icon: <Github className={ic} />, action: { type: "href", href: p.links.github } });
  }
  out.push(
    { id: "a-resume", group: "Actions", label: "View resume", icon: <FileText className={ic} />, action: { type: "href", href: "/resume" } },
    { id: "a-pdf", group: "Actions", label: "Download resume (PDF)", icon: <Download className={ic} />, action: { type: "download" } },
    { id: "a-email", group: "Actions", label: "Copy email address", hint: profile.email, icon: <Copy className={ic} />, action: { type: "copy-email" } },
    { id: "a-gh", group: "Actions", label: "GitHub profile", hint: `@${profile.githubUser}`, icon: <Github className={ic} />, action: { type: "href", href: profile.github } },
    { id: "a-li", group: "Actions", label: "LinkedIn profile", icon: <Linkedin className={ic} />, action: { type: "href", href: profile.linkedin } },
    { id: "a-theme", group: "Actions", label: "Toggle light / dark theme", keywords: "dark light mode", icon: <Moon className={ic} />, action: { type: "theme" } },
  );
  return out;
}
const ITEMS = buildItems();

export function CommandPalette() {
  const router = useRouter();
  const { toggle } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = () => { lastFocus.current = document.activeElement as HTMLElement; setQ(""); setActive(0); setOpen(true); };
  const close = () => { setOpen(false); lastFocus.current?.focus?.(); };

  const execute = (it: Item) => {
    close();
    const a = it.action;
    if (a.type === "theme") toggle();
    else if (a.type === "copy-email") navigator.clipboard?.writeText(profile.email).then(() => setToast("Email copied"), () => setToast(profile.email));
    else if (a.type === "download") { const el = document.createElement("a"); el.href = profile.resumeUrl; el.download = profile.resumeFileName; el.click(); }
    else if (a.href.startsWith("http")) window.open(a.href, "_blank", "noopener,noreferrer");
    else if (a.href.startsWith("#")) {
      if (window.location.pathname === "/") document.getElementById(a.href.slice(1))?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      else router.push("/" + a.href);
    } else router.push(a.href);
  };

  const filtered = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return ITEMS;
    return ITEMS.filter((i) => terms.every((t) => `${i.label} ${i.keywords ?? ""} ${i.group} ${i.hint ?? ""}`.toLowerCase().includes(t)));
  }, [q]);

  // global shortcut: ⌘K / Ctrl+K toggles, "/" opens when not typing; other components dispatch OPEN_EVENT
  const showRef = useRef(show);
  useEffect(() => { showRef.current = show; });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName));
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => { if (!o) { lastFocus.current = document.activeElement as HTMLElement; setQ(""); setActive(0); } return !o; });
      } else if (e.key === "/" && !typing) { e.preventDefault(); showRef.current(); }
    };
    const onOpen = () => showRef.current();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener(OPEN_EVENT, onOpen); };
  }, []);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 1800); return () => clearTimeout(t); }, [toast]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[active]) execute(filtered[active]); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Tab") e.preventDefault();                       // keep focus inside the dialog
  };
  useEffect(() => { document.getElementById(`cmdk-${filtered[active]?.id}`)?.scrollIntoView({ block: "nearest" }); }, [active, filtered]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] flex items-start justify-center bg-bg/60 px-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.15 }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
            <motion.div role="dialog" aria-modal="true" aria-label="Command palette"
              className="card w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
              initial={{ y: reduced ? 0 : -8, scale: reduced ? 1 : 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: reduced ? 0 : -8, scale: reduced ? 1 : 0.98 }}
              transition={{ duration: reduced ? 0 : 0.15 }} onKeyDown={onListKey}>
              <div className="flex items-center gap-2.5 border-b border-border px-4">
                <Search className="h-4 w-4 text-muted" aria-hidden />
                <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}
                  placeholder="Search projects, demos, sections, actions…" aria-label="Search commands"
                  role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-activedescendant={filtered[active] ? `cmdk-${filtered[active].id}` : undefined}
                  className="h-12 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted" />
                <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">esc</kbd>
              </div>
              <ul id="cmdk-list" role="listbox" aria-label="Commands" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
                {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No results for “{q}”.</li>}
                {filtered.map((it, i) => {
                  const header = i === 0 || filtered[i - 1].group !== it.group ? it.group : null;
                  return (
                    <li key={it.id} role="presentation">
                      {header && <div className="px-3 pb-1 pt-3 font-mono text-[10.5px] uppercase tracking-wider text-muted" aria-hidden>{header}</div>}
                      <div id={`cmdk-${it.id}`} role="option" aria-selected={i === active}
                        onMouseMove={() => setActive(i)} onClick={() => execute(it)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[14px] ${i === active ? "bg-surface-2 text-fg" : "text-fg-2"}`}>
                        <span className="text-muted">{it.icon}</span>
                        <span className="flex-1 truncate">{it.label}</span>
                        {it.hint && <span className="truncate text-[12px] text-muted">{it.hint}</span>}
                        {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-muted" aria-hidden />}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-[10.5px] text-muted">
                <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span><span className="ml-auto">⌘K / Ctrl K</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[95] -translate-x-1/2">
        {toast && <div className="rounded-full bg-fg px-4 py-2 text-sm text-bg shadow-lg">{toast}</div>}
      </div>
    </>
  );
}
