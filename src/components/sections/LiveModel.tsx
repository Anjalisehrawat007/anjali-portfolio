import Link from "next/link";
import { LiveModelDemo } from "@/components/demo/LiveModelDemo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const FACTS = [
  { k: "What runs", v: "GRU + temporal attention, calibrated risk, alert policy and attribution — the deployed engine, not a mock." },
  { k: "Where", v: "FastAPI on a Vercel serverless function with ONNX Runtime; the model scores all 96 steps per request." },
  { k: "What it shows", v: "When the first reliable warning was raised before the trip — the same lead-time definition used in evaluation." },
  { k: "Honesty", v: "The transformer stream is synthetic and the failure is simulated; the model was trained on real sensor data." },
];

export function LiveModel() {
  return (
    <Section id="live-model" atmosphere="grid">
      <SectionHeading
        eyebrow="Try it live"
        title="A real model, running right here."
        description={<>Inject a fault into a transformer and watch my <Link href="/projects/power-grid-failure-prediction" className="text-accent hover:underline">SmartGrid AI</Link> engine score it, step by step, on the production deployment.</>}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Reveal><LiveModelDemo /></Reveal>
        <Reveal delay={0.08}>
          <dl className="grid gap-3">
            {FACTS.map((f) => (
              <div key={f.k} className="card rounded-xl px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-accent">{f.k}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-fg-2">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
