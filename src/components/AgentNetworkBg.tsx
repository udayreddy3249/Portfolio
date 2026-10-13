"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed 3D agent-network backdrop for everything after the hero.
 * Fades in as the hero scrolls away; page scroll drives the globe and the hopping ball.
 * Pauses while the hero or the opening screen is showing, and when the tab is hidden.
 */
export function AgentNetworkBg() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current, box = wrap.current;
    if (!el || !box) return;
    let net: Awaited<ReturnType<typeof import("./three/agentNetwork")["createAgentNetwork"]>> | null = null;
    let disposed = false;
    let raf = 0;

    import("./three/agentNetwork").then(({ createAgentNetwork }) => {
      if (disposed) return;
      try {
        net = createAgentNetwork(el);
      } catch {
        return; // no WebGL
      }
      const tick = () => {
        const hero = document.getElementById("home");
        const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 0;
        const docEnd = document.documentElement.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        // 0 → 1 across the page after the hero
        const p = Math.max(0, Math.min(1, (y - heroEnd) / Math.max(1, docEnd - heroEnd)));
        // fade in over the last stretch of the hero
        const fade = Math.max(0, Math.min(1, (y - (heroEnd - window.innerHeight * 0.6)) / (window.innerHeight * 0.6)));
        const intro = document.documentElement.classList.contains("intro-active");
        box.style.opacity = String(intro ? 0 : fade);
        net!.setProgress(p);
        if (fade > 0.01 && !intro && !document.hidden) net!.start();
        else net!.stop();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      net?.dispose();
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed inset-0 -z-[5] opacity-0">
      <canvas ref={canvas} className="block size-full opacity-40 lg:opacity-55" />
    </div>
  );
}
