/**
 * Presentation-only accent tones per project (hue values). Not project data —
 * purely visual identity so each case study has its own restrained colour.
 */
export const PROJECT_TONES: Record<string, { hue: number; label: string }> = {
  rarecare: { hue: 340, label: "rose" },
  sigil: { hue: 245, label: "indigo" },
  "shouldermotion-ai": { hue: 170, label: "teal" },
  "power-grid-failure-prediction": { hue: 32, label: "amber" },
};

export function toneVars(slug: string): Record<string, string> {
  const hue = PROJECT_TONES[slug]?.hue ?? 245;
  return {
    "--tone": `oklch(0.62 0.16 ${hue})`,
    "--tone-soft": `oklch(0.62 0.16 ${hue} / 0.10)`,
    "--tone-glow": `oklch(0.62 0.16 ${hue} / 0.22)`,
  };
}
