"use client";

import { useEffect, useRef } from "react";
import { sceneState } from "@/lib/sceneStore";
import { createDevToyScene } from "./devToy";

/**
 * Mounts the Dev Toy WebGL scene. Scroll progress comes from sceneState (set by the Hero's
 * ScrollTrigger); the mouse position drives where the character looks.
 * The loop only runs while the hero is on screen and the tab is visible.
 */
export default function HeroScene() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let toy: ReturnType<typeof createDevToyScene>;
    try {
      toy = createDevToyScene(el);
    } catch {
      return; // no WebGL: the hero still reads fine without the scene
    }

    let visible = true;
    // Hold rendering while the opening screen covers the page, so loading stays smooth
    const introOn = () => document.documentElement.classList.contains("intro-active");
    const sync = () => (visible && !document.hidden && !introOn() ? toy.start() : toy.stop());
    window.addEventListener("intro:done", sync);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    let raf = 0;
    const pump = () => {
      toy.setProgress(sceneState.progress);
      raf = requestAnimationFrame(pump);
    };
    raf = requestAnimationFrame(pump);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // -1 → 1 relative to the scene's centre, y up
      const x = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 0.9;
      const y = -((e.clientY - (r.top + r.height * 0.4)) / (r.height / 2)) * 0.9;
      toy.setPointer(Math.max(-1.4, Math.min(1.4, x)), Math.max(-1.2, Math.min(1.2, y)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("intro:done", sync);
      window.removeEventListener("pointermove", onMove);
      toy.dispose();
    };
  }, []);

  return <canvas ref={canvas} className="absolute inset-0 block size-full" />;
}
