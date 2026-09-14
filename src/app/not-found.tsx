import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-start justify-center px-5 pt-24 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-5xl">This route doesn’t exist.</h1>
      <p className="mt-3 text-muted">The page may have moved, or the link was mistyped.</p>
      <Link href="/" className="mt-8 inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg hover:bg-fg/90">
        <ArrowLeft className="h-4 w-4" /> Back home
      </Link>
    </div>
  );
}
