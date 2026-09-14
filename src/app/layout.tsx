import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { ThemeProvider, themeInitScript } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const description =
  "Software developer specialising in AI/ML and full-stack engineering. Interactive case studies of RareCare, Sigil, ShoulderMotion AI and LSTM-based power-grid failure prediction.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.fullName} — Software Developer, AI/ML & Full-Stack`,
    template: `%s — ${profile.fullName}`,
  },
  description,
  keywords: ["Anjali Sehrawat", "software developer", "AI/ML", "full-stack", "Next.js", "PyTorch", "FastAPI", "portfolio"],
  authors: [{ name: profile.fullName, url: profile.siteUrl }],
  creator: profile.fullName,
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.fullName,
    title: `${profile.fullName} — Software Developer, AI/ML & Full-Stack`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${profile.fullName} — Software Developer`, description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  email: `mailto:${profile.email}`,
  url: profile.siteUrl,
  jobTitle: "Software Developer",
  sameAs: [profile.github, profile.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg">
          Skip to content
        </a>
        <ThemeProvider>
          <Navbar />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
