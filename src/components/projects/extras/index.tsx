import type { ComponentType } from "react";
import { SigilConcepts } from "./SigilConcepts";
import { LiveModelDemo } from "@/components/demo/LiveModelDemo";

/** Optional project-specific interactive extras, keyed by slug. */
export const projectExtras: Record<string, { title: string; Component: ComponentType }> = {
  sigil: { title: "Interactive mechanisms", Component: SigilConcepts },
  "power-grid-failure-prediction": { title: "Run the live model", Component: () => <LiveModelDemo compact /> },
};
