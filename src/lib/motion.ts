"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}
registerGsap();

/** Keep these in sync with the @custom-variant queries in globals.css */
export const MQ = {
  /** Large screens with motion: full cinematic scenes (hero → about stage, parallax) */
  cinematic: "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)",
  /** Tablet and up with motion: pinned horizontal projects */
  pin: "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
  /** Any width with motion allowed: scrubbed reveals */
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export function finePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(MQ.reduced).matches;
}

export { gsap, ScrollTrigger, useGSAP };
