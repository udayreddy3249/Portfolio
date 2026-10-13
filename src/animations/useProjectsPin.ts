"use client";

import type { RefObject } from "react";
import { gsap, MQ, useGSAP } from "@/lib/motion";

/**
 * Scene 3: pinned horizontal project showcase.
 * Vertical scroll drives the track's x position while the section is pinned, then releases.
 * Below 768px, on short screens, or with reduced motion, the track stays a native swipe row.
 */
export function useProjectsPin(section: RefObject<HTMLElement | null>, count: number) {
  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("header[data-reveal]"),
          { autoAlpha: 0, y: 50, scale: 0.95, filter: "blur(14px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", transformOrigin: "left bottom", ease: "power3.out", scrollTrigger: { trigger: root, start: "top 85%", end: "top 35%", scrub: 0.6 } },
        );
      });

      mm.add(MQ.pin, () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const counter = q("[data-progress-count]")[0] as HTMLElement | undefined;
        const bar = q("[data-progress-bar]")[0] as HTMLElement | undefined;
        const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) gsap.set(bar, { scaleX: self.progress });
              if (counter) {
                const idx = Math.min(count, Math.floor(self.progress * count) + 1);
                counter.textContent = String(idx).padStart(2, "0");
              }
            },
          },
        });

        // Each card eases up to full scale as it slides into view
        q("[data-project-card]").forEach((card) => {
          gsap.fromTo(
            card,
            { scale: 0.92, opacity: 0.7 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 100%",
                end: "left 62%",
                scrub: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: section },
  );
}
