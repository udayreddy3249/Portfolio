import fs from "node:fs";
import path from "node:path";
import { Nav } from "@/components/Nav";
import { Intro } from "@/components/Intro";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { SideRail } from "@/components/SideRail";
import { CursorBall } from "@/components/CursorBall";
import { Projects } from "@/components/Projects";
import { Statement } from "@/components/Statement";
import { Stats } from "@/components/Stats";
import { ExperienceTimeline } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { EducationSection } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { Ambient } from "@/components/Ambient";
import { AgentNetworkBg } from "@/components/AgentNetworkBg";
import { ScrollRefresh } from "@/components/ScrollRefresh";

// Resolved at build time: the Download Resume button only renders once public/resume.pdf exists.
const hasResume = fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"));

export default function Home() {
  return (
    <>
      <Intro />
      <Nav />
      <main>
        <Hero hasResume={hasResume} />
        <About />
        <Statement />
        <Stats />
        <Projects />
        <ExperienceTimeline />
        <Skills />
        <EducationSection />
        <Contact hasResume={hasResume} />
      </main>
      <SideRail />
      <Ambient />
      <AgentNetworkBg />
      <CursorBall />
      <ScrollRefresh />
    </>
  );
}
