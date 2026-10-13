"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MQ, useGSAP } from "@/lib/motion";

/**
 * Pinned stats scene: giant numbers focus in from a blur, hold, then hand off to the next.
 * Reduced motion: the three stats simply stack.
 */
export function Stats() {
  const section = useRef<HTMLElement>(null);
  const stats = profile.stats;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(section);
        const items = q("[data-stat]");
        const dots = q("[data-stat-dot]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: section.current, start: "top 55%", end: "bottom bottom", scrub: 1 },
        });
        const seg = 1 / items.length;
        items.forEach((el, i) => {
          const t0 = i * seg;
          const num = el.querySelector("[data-stat-num]");
          const copy = el.querySelectorAll("[data-stat-copy]");
          tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: seg * 0.15 }, t0)
            .fromTo(num, { scale: 1.45, filter: "blur(18px)", yPercent: 8 }, { scale: 1, filter: "blur(0px)", yPercent: 0, duration: seg * 0.4, ease: "power2.out" }, t0)
            .fromTo(copy, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: seg * 0.25, stagger: seg * 0.06, ease: "power2.out" }, t0 + seg * 0.22)
            .to(dots[i], { scale: 1, opacity: 1, duration: seg * 0.1 }, t0);
          if (i < items.length - 1) {
            tl.to(el, { autoAlpha: 0, y: -80, scale: 0.94, filter: "blur(8px)", duration: seg * 0.22, ease: "power1.in" }, t0 + seg * 0.78).to(
              dots[i],
              { scale: 0.6, opacity: 0.35, duration: seg * 0.1 },
              t0 + seg * 0.9,
            );
          }
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-label="By the numbers" className="relative bg-[#05060a] text-ink motion-safe:h-[360vh]">
      <div className="relative py-20 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:overflow-hidden motion-safe:py-0">
        <p className="eyebrow pt-10 text-center  motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-[calc(var(--nav-h)+28px)] motion-safe:pt-0">
          By the numbers
        </p>

        {stats.map((s) => (
          <div
            key={s.value}
            data-stat
            className="flex flex-col items-center justify-center px-5 py-14 text-center motion-safe:absolute motion-safe:inset-0 motion-safe:py-0"
          >
            <p data-stat-num className="display text-gradient pb-[0.06em] text-[clamp(6.5rem,27vw,19rem)] leading-[0.9] tracking-[-0.06em] will-change-transform">
              {s.value}
            </p>
            <p data-stat-copy className="mt-4 text-[clamp(1.4rem,3.2vw,2.6rem)] font-semibold tracking-[-0.03em] text-ink">
              {s.label}
            </p>
            <p data-stat-copy className="mt-3 text-[1rem] text-ink-muted">
              {s.detail}
            </p>
          </div>
        ))}

        {/* Progress dots */}
        <div aria-hidden className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 gap-2.5 motion-safe:flex">
          {stats.map((s) => (
            <span key={s.value} data-stat-dot className="size-2 scale-[0.6] rounded-full bg-white opacity-35" />
          ))}
        </div>
      </div>
    </section>
  );
}
