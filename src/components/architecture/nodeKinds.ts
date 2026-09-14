import {
  BrainCircuit,
  Cpu,
  Database,
  FileInput,
  Link2,
  Server,
  ShieldCheck,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { NodeKind } from "@/lib/types";

export const NODE_KINDS: Record<NodeKind, { label: string; icon: LucideIcon }> = {
  input: { label: "Input", icon: FileInput },
  model: { label: "Model", icon: BrainCircuit },
  process: { label: "Process", icon: Cpu },
  storage: { label: "Storage", icon: Database },
  chain: { label: "On-chain", icon: Link2 },
  security: { label: "Security", icon: ShieldCheck },
  output: { label: "Output", icon: Target },
  infra: { label: "Serving", icon: Server },
};
