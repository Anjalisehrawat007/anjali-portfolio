"use client";

import { useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

/**
 * Embedded PDF viewer with a download action.
 * Uses <object> so browsers without inline PDF support show the fallback.
 */
export function ResumeViewer({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-surface", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium text-fg"><FileText className="h-4 w-4 text-muted" /> {profile.resumeFileName}</span>
        <div className="flex gap-2">
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-fg-2 hover:border-border-strong hover:text-fg">
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </a>
          <a href={profile.resumeUrl} download={profile.resumeFileName} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-fg px-2.5 text-xs font-medium text-bg hover:bg-fg/90">
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>
      <div className="relative bg-surface-2">
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted" aria-hidden>
            Loading PDF…
          </div>
        )}
        <iframe
          src={`${profile.resumeUrl}#view=FitH&toolbar=0`}
          title="Resume PDF"
          className="relative h-[70vh] min-h-[560px] w-full"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <p className="border-t border-border px-4 py-2 text-xs text-muted">
        If the PDF doesn’t display, <a href={profile.resumeUrl} download={profile.resumeFileName} className="font-medium text-fg underline-offset-2 hover:underline">download it</a> or <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-fg underline-offset-2 hover:underline">open it in a new tab</a>.
      </p>
    </div>
  );
}
