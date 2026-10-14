/** Identity & contact. Source: resume (Sep 2026). */
export const profile = {
  firstName: "Anjali",
  fullName: "Anjali Sehrawat",
  title: "Software Developer — AI/ML & Full-Stack",
  headline: "I build intelligent, end-to-end software systems.",
  positioning:
    "Software developer working across AI/ML and full-stack engineering — from BioBERT and CNN-based medical screening to self-sovereign identity on Ethereum. I take ML-powered products from model to deployment with Python, PyTorch, Hugging Face, MERN and FastAPI.",
  email: "anjalisehrawat296@gmail.com",
  phone: "+91-8950832372",
  github: "https://github.com/Anjalisehrawat007",
  githubUser: "Anjalisehrawat007",
  linkedin: "https://www.linkedin.com/in/anjali-sehrawat-2a1a68357/",
  resumeUrl: "/Anjali_Sehrawat_Resume.pdf",
  resumeFileName: "Anjali_Sehrawat_Resume.pdf",
  /** Set this to the deployed origin for absolute OG URLs. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  education: {
    degree: "B.Tech in Computer Science and Engineering",
    school: "Vellore Institute of Technology",
    cgpa: "8.65",
    period: { start: "2023-08", end: null as string | null },
  },
  about: [
    "Computer Science undergraduate at VIT (CGPA 8.65) specializing in AI/ML and full-stack engineering. I build ML-powered applications end-to-end — data and model work in Python, PyTorch and Hugging Face Transformers, product surfaces in MERN and Next.js, and serving layers in FastAPI and Flask.",
    "My projects sit where applied AI meets real systems: medical screening with BioBERT and CNNs, markerless motion analysis with MediaPipe, calibrated GRU + attention early warning on real power-transformer sensor streams, and a self-sovereign identity platform on Ethereum with WebAuthn, Merkle batching and zero-knowledge proofs.",
    "I'm grounded in data structures, algorithms, operating systems, networks and compiler design, and ship with production tooling — Docker, Git, AWS/GCP.",
  ],
} as const;
