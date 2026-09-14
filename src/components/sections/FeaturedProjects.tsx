import { Section, SectionHeading } from "@/components/ui/Section";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";

export function FeaturedProjects() {
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Featured projects"
        title="Product → Engineering → Proof"
        description="Four systems, each with an interactive architecture and a case study. Filter by domain, or pick a technology in the Skills section to see where it's used."
      />
      <ProjectExplorer />
    </Section>
  );
}
