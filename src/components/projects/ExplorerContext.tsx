"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Category } from "@/lib/types";

/**
 * Shared exploration state for the home page.
 * - `activeTech`: a technology selected in the Skill Explorer or Tech Graph;
 *   projects and experience entries using it are highlighted.
 * - `category`: the active project filter.
 */
interface ExplorerState {
  activeTech: string | null;
  setActiveTech: (t: string | null) => void;
  category: Category | "All";
  setCategory: (c: Category | "All") => void;
  /** Select a tech and scroll to the projects section. */
  focusTech: (t: string) => void;
}

const Ctx = createContext<ExplorerState | null>(null);

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | "All">("All");

  const focusTech = useCallback((t: string) => {
    setActiveTech(t);
    setCategory("All");
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const value = useMemo(
    () => ({ activeTech, setActiveTech, category, setCategory, focusTech }),
    [activeTech, category, focusTech],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const fallback: ExplorerState = {
  activeTech: null,
  setActiveTech: () => {},
  category: "All",
  setCategory: () => {},
  focusTech: () => {},
};

/** Safe outside the provider (e.g. on case-study pages). */
export function useExplorer() {
  return useContext(Ctx) ?? fallback;
}
