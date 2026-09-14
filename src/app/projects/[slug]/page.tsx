import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.shortName} — ${profile.fullName}`;
  return {
    title: p.shortName,
    description: p.tagline,
    openGraph: { title, description: p.tagline, type: "article", url: `/projects/${p.slug}` },
    twitter: { card: "summary_large_image", title, description: p.tagline },
    alternates: { canonical: `/projects/${p.slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.tagline,
    author: { "@type": "Person", name: profile.fullName, url: profile.siteUrl },
    programmingLanguage: project.technologies,
    ...(project.links.github ? { codeRepository: project.links.github } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectCaseStudy project={project} />
    </>
  );
}
