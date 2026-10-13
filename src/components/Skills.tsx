"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MQ, useGSAP } from "@/lib/motion";
import { SectionHeading } from "./ui/SectionHeading";
import { useReveal } from "@/animations/useReveal";

const ACCENTS = ["#0071e3", "#bf5af2", "#ff375f", "#30b0c7", "#ff9f0a", "#34c759"];

export function Skills() {
  const section = useRef<HTMLElement>(null);
  useReveal(section, "header [data-reveal]");

  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q("[data-skill-group]").forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 94%", end: "top 70%", scrub: 0.6 },
            },
          );
          const chips = card.querySelectorAll("[data-chip]");
          gsap.fromTo(
            chips,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 88%", end: "top 62%", scrub: 0.6 },
            },
          );
          void i;
        });
      });
      // Depth: columns drift at slightly different rates on large screens
      mm.add(MQ.cinematic, () => {
        q("[data-depth]").forEach((col) => {
          const d = Number((col as HTMLElement).dataset.depth);
          gsap.fromTo(
            col,
            { y: d * 40 },
            { y: -d * 40, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  // Split groups into three columns for masonry-like depth on desktop
  const cols: (typeof profile.skills)[number][][] = [[], [], []];
  profile.skills.forEach((g, i) => cols[[0, 1, 2, 1, 0, 2][i] ?? i % 3].push(g));

  return (
    <section ref={section} id="skills" aria-labelledby="skills-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills & technologies"
          title={
            <>
              A toolkit for <span className="text-gradient">intelligent systems.</span>
            </>
          }
        />

        {/* Mobile/tablet: simple stack. Desktop: three columns with depth. */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {cols.map((col, ci) => (
            <div key={ci} data-depth={[0.4, -0.3, 0.6][ci]} className="contents lg:flex lg:flex-col lg:gap-5">
              {col.map((g) => {
                const idx = profile.skills.indexOf(g);
                const accent = ACCENTS[idx % ACCENTS.length];
                return (
                  <article key={g.name} data-skill-group className="tile p-6 md:p-8">
                    <div className="flex items-center gap-3">
                      <span aria-hidden className="size-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 0 5px ${accent}1f` }} />
                      <h3 className="text-[1.1rem] font-semibold tracking-[-0.02em] text-ink">{g.name}</h3>
                      <span className="ml-auto text-xs font-medium tabular-nums text-ink-muted">{String(g.skills.length).padStart(2, "0")}</span>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {g.skills.map((s) => (
                        <li
                          key={s}
                          data-chip
                          className="rounded-full bg-ivory px-3 py-1.5 text-[0.86rem] text-ink transition-transform duration-300 hover:-translate-y-0.5"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
