/**
 * Engineering themes evidenced by the resume. Each theme cites the project or
 * role that demonstrates it — no invented quotes, no generic motivation.
 */
export const philosophy = [
  {
    id: "end-to-end",
    title: "Ship the whole system, not just the model.",
    body: "A model that only lives in a notebook isn't a product. RareCare pairs BioBERT and CNNs with a Flask serving layer and Hugging Face hosting; ShoulderMotion AI wraps MediaPipe analysis in a FastAPI backend behind a Flutter client.",
    evidence: ["rarecare", "shouldermotion-ai"],
  },
  {
    id: "explainability",
    title: "Explainability is a feature.",
    body: "ASRI and DMQE were designed so a clinician can read why a score is what it is. Selective disclosure and zero-knowledge proofs in Sigil are the same instinct applied to privacy: expose exactly what's needed, and make that legible.",
    evidence: ["shouldermotion-ai", "sigil"],
  },
  {
    id: "security",
    title: "Security is architecture, not a checklist.",
    body: "WebAuthn instead of passwords, Merkle roots instead of per-credential transactions, M-of-N guardians instead of a reset-password endpoint. Each choice in Sigil removes a single point of trust.",
    evidence: ["sigil"],
  },
  {
    id: "measure",
    title: "Performance gets measured.",
    body: "At Ayuka Developers, targeted debugging and testing improved load time by 15% and cut turnaround time by 10%. At Zidio, automated Tableau dashboards reduced manual reporting time by 15%.",
    evidence: ["ayuka", "zidio"],
  },
  {
    id: "real-problems",
    title: "Real signals, real stakes.",
    body: "Real transformer sensor streams for early warning of failures. Postoperative shoulder recovery. Stigma-associated diseases where people delay seeking help. The problems pick the architecture, not the other way around.",
    evidence: ["power-grid-failure-prediction", "shouldermotion-ai", "rarecare"],
  },
  {
    id: "fundamentals",
    title: "Fundamentals underneath everything.",
    body: "Data structures and algorithms, operating systems, computer networks, compiler design. Multi-component systems — model, serving, client, chain — are easier to reason about when the layers below are familiar.",
    evidence: [],
  },
] as const;
