"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MQ, useGSAP } from "@/lib/motion";
import { SectionHeading } from "./ui/SectionHeading";
import { useReveal } from "@/animations/useReveal";

export function ExperienceTimeline() {
  const section = useRef<HTMLElement>(null);
  useReveal(section, "header [data-reveal]");

  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // The line draws with scroll progress through the list
        gsap.fromTo(
          q("[data-line-fill]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-timeline]")[0], start: "top 70%", end: "bottom 60%", scrub: 0.5 },
          },
        );
        q("[data-role]").forEach((role) => {
          const dot = role.querySelector("[data-dot]");
          const card = role.querySelector("[data-role-card]");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: role, start: "top 82%", end: "top 52%", scrub: 0.6 },
          });
          tl.fromTo(dot, { scale: 0.4, opacity: 0.3 }, { scale: 1, opacity: 1, ease: "back.out(2)", duration: 0.3 }, 0).fromTo(
            card,
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, ease: "power3.out", duration: 0.7 },
            0,
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} id="experience" aria-labelledby="experience-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="experience-title"
          eyebrow="Experience"
          title={
            <>
              From backend systems <br className="hidden md:block" />
              to <span className="text-gradient">applied AI.</span>
            </>
          }
          lead="Three roles across enterprise automation, university research, and global financial services."
        />

        <div data-timeline className="relative mt-16 md:mt-24">
          {/* Track + scroll-drawn fill */}
          <div aria-hidden className="absolute bottom-2 left-[11px] top-2 w-px bg-ink/10 md:left-[calc(25%+11px)]">
            <div data-line-fill className="absolute inset-0 origin-top bg-[linear-gradient(180deg,#0894ff,#c959dd_40%,#ff2e54_75%,#ff9004)]" />
          </div>

          <ol className="space-y-14 md:space-y-20">
            {profile.experience.map((job) => (
              <li key={job.company + job.role} data-role className="relative grid grid-cols-1 gap-4 pl-10 md:grid-cols-4 md:gap-0 md:pl-0">
                <div className="md:pr-10 md:text-right">
                  <p className="text-[0.9rem] font-semibold tabular-nums text-ink">
                    <time>{job.start}</time> — <time>{job.end}</time>
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{job.location}</p>
                </div>

                <span
                  data-dot
                  aria-hidden
                  className={`absolute left-0 top-0.5 grid size-[23px] place-items-center rounded-full border border-white/20 bg-paper shadow-[0_4px_14px_-4px_rgba(40,50,110,0.35)] md:left-[25%] ${
                    job.company === "Arizona State University" ? "ring-2 ring-gold/70" : ""
                  }`}
                >
                  <span className={`size-2.5 rounded-full ${job.current ? "bg-sky-deep" : job.company === "Arizona State University" ? "bg-gold" : "bg-lavender-deep"}`} />
                </span>

                <article data-role-card className="tile p-6 md:col-span-3 md:ml-12 md:p-9">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="text-[1.45rem] font-semibold tracking-[-0.025em] text-ink">{job.company}</h3>
                    {job.current && (
                      <span className="rounded-full bg-sky-deep/10 px-2.5 py-0.5 text-[0.75rem] font-semibold text-sky-deep">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[1.02rem] font-medium text-ink-soft">{job.role}</p>
                  <ul className="mt-5 space-y-2.5">
                    {job.bullets.map((b) => (
                      <li key={b} className="relative pl-5 text-[0.97rem] leading-relaxed text-ink-soft">
                        <span aria-hidden className="absolute left-0 top-[0.62em] size-1.5 rounded-full bg-ink/20" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
