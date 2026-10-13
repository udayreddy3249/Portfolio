"use client";

import Image from "next/image";
import { useRef } from "react";
import { profile } from "@/content/profile";
import { useProjectsPin } from "@/animations/useProjectsPin";
import { ProjectCover } from "./ui/ProjectCover";
import { TiltCard } from "./ui/TiltCard";
import { ArrowUpRightIcon, GitHubIcon } from "./ui/Icons";

export function Projects() {
  const section = useRef<HTMLElement>(null);
  const projects = profile.projects;
  useProjectsPin(section, projects.length);

  return (
    <section
      ref={section}
      id="projects"
      aria-labelledby="projects-title"
      className="relative overflow-x-clip py-24 md:py-28 pinmode:flex pinmode:h-svh pinmode:flex-col pinmode:justify-center pinmode:py-0 pinmode:pt-[calc(var(--nav-h)+8px)]"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-6 px-5 md:px-8">
        <header className="max-w-2xl pinmode:max-w-4xl" data-reveal>
          <p className="eyebrow mb-4">Selected work</p>
          <h2 id="projects-title" className="display text-[clamp(2.3rem,4.8vw,4.2rem)] pinmode:text-[clamp(2.2rem,3.7vw,3.5rem)]">
            Systems built for <span className="text-gradient">production.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ink-soft pinmode:[@media(max-height:860px)]:hidden">
            Highlights from my engineering work at qBotica and JPMorganChase — from retrieval and voice to event-driven backends.
          </p>
        </header>

        {/* Progress (pinned mode) */}
        <div aria-hidden className="hidden items-center gap-4 pinmode:flex">
          <span className="text-sm font-medium tabular-nums text-ink">
            <span data-progress-count>01</span>
            <span className="text-ink-muted"> / {String(projects.length).padStart(2, "0")}</span>
          </span>
          <span className="relative h-[2px] w-32 overflow-hidden rounded-full bg-ink/10">
            <span data-progress-bar className="absolute inset-0 origin-left scale-x-0 rounded-full bg-ink" />
          </span>
        </div>
      </div>

      {/* Track: native swipe row on mobile / reduced motion; GSAP-translated row when pinned */}
      <div className="snap-row mt-10 snap-x snap-mandatory scroll-px-5 overflow-x-auto md:scroll-px-8 pinmode:mt-10 pinmode:snap-none pinmode:overflow-visible">
        <ul
          data-track
          className="flex w-max gap-5 px-5 pb-4 will-change-transform md:gap-7 md:px-8 lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
        >
          {projects.map((p, i) => (
            <li key={p.slug} data-project-card className="w-[84vw] max-w-[500px] shrink-0 snap-start sm:w-[62vw] md:w-[46vw] lg:w-[min(34vw,470px)]">
              <TiltCard className="tile h-full overflow-hidden">
                <article className="flex h-full flex-col" aria-labelledby={`p-${p.slug}`}>
                  <div className="relative aspect-[16/10] overflow-hidden pinmode:aspect-[16/8] pinmode:[@media(max-height:760px)]:aspect-[16/6.5]">
                    {p.image ? (
                      <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 36vw, 84vw" className="object-cover" />
                    ) : (
                      <ProjectCover motif={p.motif} title={p.title} />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-black/50 px-2.5 py-0.5 text-[0.75rem] font-semibold tabular-nums text-ink backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <p className="text-[0.85rem] font-semibold text-ink-muted">{p.context}</p>
                    <h3 id={`p-${p.slug}`} className="mt-2.5 text-[1.4rem] font-semibold leading-tight tracking-[-0.025em] text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-soft pinmode:line-clamp-3">{p.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                      {p.tags.map((t) => (
                        <li key={t} className="rounded-full bg-ivory px-2.5 py-1 text-[0.78rem] text-ink-soft">
                          {t}
                        </li>
                      ))}
                    </ul>
                    {(p.liveUrl || p.githubUrl) && (
                      <div className="mt-auto flex gap-4 pt-6 text-[0.9rem] font-medium">
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink hover:underline">
                            Live <ArrowUpRightIcon width={16} height={16} />
                          </a>
                        )}
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink hover:underline">
                            <GitHubIcon width={16} height={16} /> Code
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
