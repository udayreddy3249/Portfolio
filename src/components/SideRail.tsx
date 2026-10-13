"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, MQ, useGSAP } from "@/lib/motion";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./ui/Icons";

/**
 * Fixed left rail (large screens): a glowing ball that travels down a track as you scroll
 * the page, above the social links.
 */
export function SideRail() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-rail-ball]",
          { y: 0 },
          {
            y: () => (root.current?.querySelector("[data-rail-track]") as HTMLElement).offsetHeight - 14,
            ease: "none",
            scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
          },
        );
        gsap.fromTo(
          "[data-rail-fill]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const link = "grid size-10 place-items-center text-ink-soft transition-colors duration-300 hover:text-sky-deep";

  return (
    <div ref={root} className="fixed bottom-8 left-6 z-40 hidden flex-col items-center gap-6 lg:flex">
      <div data-rail-track aria-hidden className="relative h-40 w-px bg-white/[0.12]">
        <div data-rail-fill className="absolute inset-0 origin-top bg-[linear-gradient(180deg,#3ee6d8,#a78bfa)]" />
        <span
          data-rail-ball
          className="absolute -left-[6.5px] top-0 size-3.5 rounded-full bg-[#d9c4ff] shadow-[0_0_14px_4px_rgba(180,140,255,0.75),0_0_34px_8px_rgba(62,230,216,0.25)]"
        />
      </div>
      <nav aria-label="Social links" className="flex flex-col items-center gap-1">
        {profile.links.github && (
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className={link}>
            <GitHubIcon />
          </a>
        )}
        <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className={link}>
          <LinkedInIcon />
        </a>
        <a href={`mailto:${profile.links.email}`} aria-label={`Email ${profile.links.email}`} className={link}>
          <MailIcon />
        </a>
      </nav>
    </div>
  );
}
