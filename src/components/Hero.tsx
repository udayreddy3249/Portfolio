"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/motion";
import { sceneState } from "@/lib/sceneStore";
import { ArrowRightIcon, DownloadIcon } from "./ui/Icons";

// WebGL scene loads on the client only, after the page is interactive.
const HeroScene = dynamic(() => import("./three/HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center">
      <div className="size-40 animate-pulse rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.35),transparent)]" />
    </div>
  );
}

export function Hero({ hasResume }: { hasResume: boolean }) {
  const root = useRef<HTMLElement>(null);

  // Entrance: plays on load, or right after the opening screen closes.
  useEffect(() => {
    const els = root.current?.querySelectorAll("[data-hero-in]");
    if (!els) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(els, { opacity: 1 });
      return;
    }
    const play = () =>
      gsap.fromTo(els, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: "power3.out", delay: 0.1, overwrite: true });
    if (document.documentElement.classList.contains("intro-active")) {
      window.addEventListener("intro:done", play, { once: true });
      return () => window.removeEventListener("intro:done", play);
    }
    play();
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      // Desktop: the hero pins (CSS sticky) while scroll drives the orb + camera, then the copy leaves.
      mm.add(MQ.cinematic, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            // The toy plays its full routine over the first 80% of the pinned scroll
            onUpdate: (self) => (sceneState.progress = Math.min(1, self.progress / 0.8)),
          },
        });
        tl.to({}, { duration: 0.82 })
          .to(q("[data-hero-card]"), { opacity: 0, x: 60, stagger: 0.04, duration: 0.12, ease: "power1.in" }, 0.82)
          .to(q("[data-hero-copy]"), { opacity: 0, y: -50, duration: 0.12, ease: "power1.in" }, 0.86)
          .to(q("[data-hero-scene]"), { scale: 0.94, opacity: 0.3, duration: 0.14, ease: "power1.in" }, 0.86);
      });

      // Smaller screens: orb still follows scroll through the hero
      mm.add(`not all and ${MQ.cinematic}`, () => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => (sceneState.progress = Math.min(1, self.progress * 1.8)),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" aria-label="Introduction" className="relative cinematic:h-[320vh]">
      <div className="relative overflow-hidden cinematic:sticky cinematic:top-0 cinematic:h-svh">
        {/* Edge glows */}
        <div aria-hidden className="pointer-events-none absolute -left-[18vw] top-[8%] h-[70%] w-[36vw] rounded-full bg-[radial-gradient(closest-side,rgba(62,230,216,0.16),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -right-[16vw] top-[30%] h-[70%] w-[34vw] rounded-full bg-[radial-gradient(closest-side,rgba(62,230,216,0.13),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute left-[20%] top-[30%] h-[60%] w-[44%] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.12),transparent)]" />

        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col px-5 pt-[calc(var(--nav-h)+12px)] md:px-10 lg:flex-row lg:items-center lg:pt-[var(--nav-h)]">
          {/* 3D scene */}
          <div
            data-hero-scene
            role="img"
            aria-label="3D toy developer at his desk who swivels, waves and stands up as you scroll"
            className="relative h-[54svh] min-h-[340px] w-full [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_84%,transparent),linear-gradient(to_top,transparent,#000_14%)] [mask-composite:intersect] [-webkit-mask-composite:source-in] lg:h-[82svh] lg:w-[60%] lg:flex-none cinematic:h-full"
          >
            <HeroScene />
          </div>

          {/* Copy + capability cards */}
          <div className="relative z-10 pb-16 lg:w-[40%] lg:pb-0 lg:pl-4">
            <div data-hero-copy>
              <p data-hero-in className="eyebrow">
                {profile.title}
              </p>
              <h1 data-hero-in className="display mt-4 text-[clamp(2.3rem,3.5vw,3.5rem)] uppercase text-ink lg:whitespace-nowrap">
                {profile.name}
              </h1>
              <p data-hero-in className="text-gradient mt-3 text-[clamp(1.05rem,1.4vw,1.3rem)] font-semibold">
                {profile.titleAccent}
              </p>
              <p data-hero-in className="mt-4 max-w-md text-[0.96rem] leading-relaxed text-ink-soft lg:[@media(max-height:820px)]:hidden">
                {profile.intro}
              </p>
              <div data-hero-in className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href="#projects" className="label-caps group inline-flex items-center gap-2 text-ink">
                  View my work
                  <ArrowRightIcon width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                {hasResume && (
                  <a href={profile.links.resume} download className="label-caps inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                    Resume <DownloadIcon width={16} height={16} />
                  </a>
                )}
              </div>
            </div>

            <ul className="mt-8 flex flex-col gap-4 lg:mt-8">
              {profile.heroCards.map((c) => (
                <li key={c.title} data-hero-card>
                  <div data-hero-in>
                    <HeroCard {...c} />
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

function HeroCard({ title, subtitle, body, tags }: { title: string; subtitle: string; body: string; tags: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <article className="bracket relative px-6 py-5 md:px-7">
      <h2 className="display text-[clamp(1.35rem,1.9vw,1.8rem)] uppercase text-ink">{title}</h2>
      <p className="mt-1.5 text-[0.85rem] tracking-[0.04em] text-ink-muted">{subtitle}</p>
      <p className="mt-3 pr-10 text-[0.9rem] leading-relaxed text-ink-soft lg:[@media(max-height:760px)]:hidden">{body}</p>
      <div id={id} className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <ul className="flex min-h-0 flex-wrap gap-2 overflow-hidden" aria-label={`${title} tools`}>
          {tags.map((t) => (
            <li key={t} className="mt-4 rounded-full border border-white/15 px-3 py-1 text-[0.78rem] text-ink-soft first:ml-0">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${open ? "Hide" : "Show"} ${title} tools`}
        onClick={() => setOpen((o) => !o)}
        className="absolute bottom-5 right-5 grid size-8 place-items-center border border-white/40 text-ink transition-colors hover:bg-white hover:text-[#080a10]"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </article>
  );
}
