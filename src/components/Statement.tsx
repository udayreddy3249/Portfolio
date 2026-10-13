"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MQ, useGSAP } from "@/lib/motion";

/**
 * Apple-style "read as you scroll" statement: the paragraph pins while each word
 * lights up from soft grey to ink in step with scroll progress.
 */
export function Statement() {
  const section = useRef<HTMLElement>(null);
  const words = profile.statement.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(section);
        gsap.fromTo(
          q("[data-word]"),
          { color: "#2a3040" },
          {
            color: "#eceff5",
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: section.current, start: "top 35%", end: "bottom 85%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-label="Statement" className="relative motion-safe:h-[230vh]">
      <div className="flex items-center py-28 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:py-0">
        <p className="display mx-auto max-w-5xl px-5 text-[clamp(2.1rem,5.2vw,4.6rem)] leading-[1.08] tracking-[-0.035em] text-ink md:px-8">
          {words.map((w, i) => (
            <span key={i} data-word className="motion-safe:text-[#2a3040]">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
