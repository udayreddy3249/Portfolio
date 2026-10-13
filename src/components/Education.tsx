"use client";

import Image from "next/image";
import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MQ, useGSAP } from "@/lib/motion";
import { useReveal } from "@/animations/useReveal";

export function EducationSection() {
  const section = useRef<HTMLElement>(null);
  useReveal(section);
  const { graduation } = profile.photos;

  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      // Desktop: the photo pins and expands from a small card to the full screen (Apple-style).
      mm.add(MQ.cinematic, () => {
        const wrap = q("[data-grad-wrap]")[0];
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: wrap, start: "top 75%", end: "bottom bottom", scrub: 1 },
        });
        tl.fromTo(
          q("[data-grad-panel]"),
          { clipPath: "inset(16% 26% 16% 26% round 36px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.6, ease: "power2.inOut" },
          0,
        )
          .fromTo(q("[data-grad-img]"), { scale: 1.35 }, { scale: 1, duration: 0.6, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-grad-scrim]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.45)
          .fromTo(q("[data-grad-caption] > *"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.18, stagger: 0.05, ease: "power2.out" }, 0.55)
          .to({}, { duration: 0.15 }, 0.85);
      });
      // Tablet: the photo grows from a small card into a wide panel as it enters
      mm.add("(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const wrap = q("[data-grad-wrap]")[0];
        gsap.fromTo(
          q("[data-grad-panel]"),
          { scale: 0.6, borderRadius: 32 },
          { scale: 1, borderRadius: 16, ease: "none", scrollTrigger: { trigger: wrap, start: "top 95%", end: "center 55%", scrub: 0.8 } },
        );
        gsap.fromTo(
          q("[data-grad-caption]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, ease: "power3.out", scrollTrigger: { trigger: wrap, start: "top 55%", end: "top 25%", scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} id="education" aria-labelledby="education-title" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="max-w-3xl">
          <p className="eyebrow mb-5" data-reveal>
            Education &amp; certifications
          </p>
          <h2 id="education-title" className="display text-[clamp(2.4rem,5.4vw,4.6rem)]" data-reveal>
            Learning that <span className="text-gradient">compounds.</span>
          </h2>
        </header>

      </div>

      {/* Graduation Walk — the cinematic moment (full-screen on desktop) */}
      <div
        data-grad-wrap
        className="mx-auto mt-14 max-w-6xl px-5 md:mt-20 md:px-8 cinematic:mt-6 cinematic:h-[250vh] cinematic:max-w-none cinematic:px-0"
      >
        <div className="cinematic:sticky cinematic:top-0 cinematic:h-svh">
          <figure
            data-grad-panel
            className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-[#1b1830] shadow-[0_50px_100px_-40px_rgba(30,30,80,0.55)] will-change-transform md:aspect-[16/11] md:rounded-[16px] cinematic:aspect-auto cinematic:h-full cinematic:rounded-none cinematic:shadow-none"
          >
            <div data-grad-img className="absolute inset-0 will-change-transform">
              <Image
                src={graduation.src}
                alt={graduation.alt}
                fill
                sizes="100vw"
                loading="eager"
                fetchPriority="low"
                className="object-cover object-[50%_40%] md:object-[50%_38%] cinematic:object-[50%_32%]"
              />
            </div>
            {/* Scrim on the dark sky for caption contrast; bottom melts into ivory */}
            <div data-grad-scrim aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(8,10,28,0.62),rgba(8,10,28,0))] cinematic:h-full cinematic:bg-[linear-gradient(90deg,rgba(8,10,28,0.7)_0%,rgba(8,10,28,0.25)_45%,rgba(8,10,28,0)_70%)]" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,rgba(8,10,16,0),rgba(8,10,16,0.9)_80%,#080a10)] cinematic:hidden" />
            <figcaption data-grad-caption className="absolute left-5 right-5 top-5 md:left-10 md:top-10 cinematic:bottom-[14vh] cinematic:left-[7vw] cinematic:right-auto cinematic:top-auto cinematic:max-w-[40vw]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.8rem] font-semibold text-white backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-gold" /> Class of 2026
              </span>
              <p className="mt-4 max-w-xl text-[clamp(1.35rem,3vw,2.4rem)] font-semibold leading-tight tracking-[-0.025em] text-white cinematic:max-w-none cinematic:text-[clamp(2.4rem,4.2vw,4.2rem)] cinematic:leading-[1.02]">
                {profile.graduationCaption}
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Degrees + certifications */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-6 lg:grid-cols-12">
          <div className="grid gap-5 lg:col-span-7">
            {profile.education.map((e) => {
              const asu = e.school === "Arizona State University";
              return (
                <article key={e.school} data-reveal className="tile flex gap-5 p-6 md:p-8">
                  <span
                    aria-hidden
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-semibold ${
                      asu ? "bg-gold/15 text-gold ring-1 ring-gold/40" : "bg-lavender text-lavender-deep"
                    }`}
                  >
                    {asu ? "M.S." : "CS"}
                  </span>
                  <div>
                    <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{e.school}</h3>
                    <p className="mt-1 text-ink-soft">{e.degree}</p>
                    <p className="mt-2 text-[0.9rem] tabular-nums text-ink-muted">
                      {e.start} — {e.end}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div data-reveal className="tile p-6 md:p-8 lg:col-span-5">
            <h3 className="eyebrow">Certifications</h3>
            <ul className="mt-5 divide-y divide-ink/[0.07]">
              {profile.certifications.map((c, i) => (
                <li key={c.name} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                  <span
                    aria-hidden
                    className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-semibold ${
                      i === 0 ? "bg-sky-deep text-ivory" : "bg-white/[0.06] text-ink-soft ring-1 ring-white/10"
                    }`}
                  >
                    ✓
                  </span>
                  <div>
                    <p className="font-medium leading-snug text-ink">{c.name}</p>
                    <p className="text-sm text-ink-muted">{c.issuer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
