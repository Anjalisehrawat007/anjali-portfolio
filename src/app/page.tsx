import { ExplorerProvider } from "@/components/projects/ExplorerContext";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { SkillExplorer } from "@/components/sections/SkillExplorer";
import { GitHubActivity } from "@/components/github/GitHubActivity";
import { Philosophy } from "@/components/sections/Philosophy";
import { Achievements } from "@/components/sections/Achievements";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <ExplorerProvider>
      <Hero />
      <FeaturedProjects />
      <ExperienceTimeline />
      <SkillExplorer />
      <GitHubActivity />
      <Philosophy />
      <Achievements />
      <About />
      <Contact />
    </ExplorerProvider>
  );
}
