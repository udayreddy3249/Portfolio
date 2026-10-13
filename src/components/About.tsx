"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { useReveal } from "@/animations/useReveal";

export function About() {
  const section = useRef<HTMLElement>(null);
  useReveal(section);
  const { about } = profile;

  return (
    <section ref={section} id="about" aria-labelledby="about-title" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-5" data-reveal>
            About
          </p>
          <h2 id="about-title" className="display text-[clamp(2.3rem,4.6vw,4rem)]" data-reveal>
            {about.heading[0]} <span className="text-gradient">{about.heading[1]}</span>
          </h2>
          <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft md:text-lg" data-reveal>
            {about.summary}
          </p>
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft md:text-lg" data-reveal>
            {about.closing}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2" data-reveal>
            <span className="label-caps mr-2 text-ink-muted">Open to</span>
            {about.openTo.map((r) => (
              <span key={r} className="rounded-full border border-white/15 px-3 py-1 text-[0.85rem] text-ink">
                {r}
              </span>
            ))}
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-4 self-end sm:grid-cols-2 lg:col-span-5">
          {about.highlights.map((h) => (
            <li key={h.label} data-reveal className="tile p-6">
              <p className="label-caps text-sky-deep">{h.label}</p>
              <p className="mt-4 text-[1.1rem] font-semibold leading-snug text-ink">{h.value}</p>
              <p className="mt-1.5 text-sm text-ink-muted">{h.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
