"use client";

import type { RefObject } from "react";
import { gsap, MQ, useGSAP } from "@/lib/motion";

/**
 * Scrubbed upward reveal for every [data-reveal] element inside `scope`.
 * Tied to scroll position, so it reverses naturally when scrolling back up.
 * Reduced motion: does nothing — content is simply visible.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, selector = "[data-reveal]") {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const els = gsap.utils.toArray<HTMLElement>(selector, scope.current);
        els.forEach((el) => {
          // Headlines get the Apple treatment: they sharpen out of a soft blur while settling in scale.
          const headline = el.tagName === "H2";
          gsap.fromTo(
            el,
            headline ? { autoAlpha: 0, y: 50, scale: 0.94, filter: "blur(14px)" } : { autoAlpha: 0, y: 36 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              ease: "power3.out",
              transformOrigin: "left bottom",
              scrollTrigger: { trigger: el, start: "top 94%", end: headline ? "top 58%" : "top 66%", scrub: 0.8 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
