import type { ComponentType } from "react";
import { SigilConcepts } from "./SigilConcepts";
import { SensorStream } from "./SensorStream";

/** Optional project-specific interactive extras, keyed by slug. */
export const projectExtras: Record<string, { title: string; Component: ComponentType }> = {
  sigil: { title: "Interactive mechanisms", Component: SigilConcepts },
  "power-grid-failure-prediction": { title: "Streaming inference", Component: SensorStream },
};
