"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

/**
 * Glowing ball that follows the mouse, with a slower ring trailing behind it.
 * Both grow over links and buttons. Mouse users with motion allowed only.
 */
export function CursorBall() {
  const ball = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const b = ball.current, r = ring.current;
    if (!b || !r || !fine || reduced) return;
    const bx = gsap.quickTo(b, "x", { duration: 0.18, ease: "power3.out" });
    const by = gsap.quickTo(b, "y", { duration: 0.18, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3.out" });
    let shown = false, hot = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set([b, r], { x: e.clientX, y: e.clientY });
        gsap.to([b, r], { opacity: 1, duration: 0.3 });
        shown = true;
      }
      bx(e.clientX); by(e.clientY); rx(e.clientX); ry(e.clientY);
      const over = !!(e.target as Element | null)?.closest?.("a, button, input");
      if (over !== hot) {
        hot = over;
        gsap.to(b, { scale: over ? 0.5 : 1, duration: 0.25 });
        gsap.to(r, { scale: over ? 1.7 : 1, borderColor: over ? "rgba(62,230,216,0.9)" : "rgba(196,162,255,0.55)", duration: 0.3 });
      }
    };
    const leave = () => { gsap.to([b, r], { opacity: 0, duration: 0.3 }); shown = false; };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-5 -mt-5 size-10 rounded-full border border-[rgba(196,162,255,0.55)] opacity-0"
      />
      <div
        ref={ball}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[71] -ml-2 -mt-2 size-4 rounded-full bg-[#efe6ff] opacity-0 shadow-[0_0_12px_4px_rgba(180,140,255,0.8),0_0_32px_10px_rgba(62,230,216,0.25)]"
      />
    </>
  );
}
