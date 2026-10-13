"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { gsap, ScrollTrigger } from "@/lib/motion";

const ROLES = [profile.title, ...profile.about.openTo];
const GLYPHS = "01<>/{}[]#*+=~ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const RING = 2 * Math.PI * 54;

/**
 * Opening screen: the name rises in, a role line "decodes" through Uday's roles,
 * and the site's glowing ball fills a ring as the page loads. Enter → the ball bursts
 * outward into the hero. Shown on every visit; html.intro-active is set before paint by layout.tsx and again on mount.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const roleEl = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const leaving = useRef(false);

  // Turn the opening screen on from here too, in case hydration rewrote the <html> classes.
  // Layout effects run before every other effect on the page, so the hero and 3D scene see it.
  useLayoutEffect(() => {
    document.documentElement.classList.add("js", "intro-active");
  }, []);

  const active = () => document.documentElement.classList.contains("intro-active");
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Loading: time-based, held at 90% until fonts and page assets are ready.
  useEffect(() => {
    if (!active()) return;
    window.scrollTo(0, 0);
    let fontsDone = false, loadDone = document.readyState === "complete";
    document.fonts?.ready.then(() => (fontsDone = true));
    const onLoad = () => (loadDone = true);
    window.addEventListener("load", onLoad);
    const start = performance.now();
    const minMs = reducedMotion() ? 300 : 2200;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / minMs);
      const shown = Math.min(fontsDone && loadDone ? 1 : 0.9, 1 - Math.pow(1 - t, 2));
      setPct(Math.round(shown * 100));
      if (shown < 1) raf = requestAnimationFrame(tick);
      else setReady(true);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (ready) button.current?.focus({ preventScroll: true });
  }, [ready]);

  // Name rises in; role line decodes through each role.
  useEffect(() => {
    if (!active() || !root.current) return;
    const q = gsap.utils.selector(root.current);
    const el = roleEl.current!;
    if (reducedMotion()) {
      el.textContent = ROLES[0];
      return;
    }
    gsap.fromTo(q("[data-char]"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.035, ease: "expo.out", delay: 0.15 });
    gsap.fromTo(q("[data-fade]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "power3.out" });

    let i = 0, frame = 0, timer = 0, stopped = false;
    const decode = (text: string) => {
      let f = 0;
      const total = 22;
      const step = () => {
        if (stopped) return;
        const solved = Math.floor((f / total) * text.length);
        let out = "";
        for (let k = 0; k < text.length; k++) {
          out += k < solved || text[k] === " " ? text[k] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (f++ < total) frame = requestAnimationFrame(step);
        else el.textContent = text;
      };
      step();
    };
    const next = () => {
      decode(ROLES[i % ROLES.length].toUpperCase());
      i++;
      timer = window.setTimeout(next, 1900);
    };
    timer = window.setTimeout(next, 450);
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  const enter = () => {
    if (!ready || leaving.current || !root.current) return;
    leaving.current = true;
    const q = gsap.utils.selector(root.current);
    const finish = () => {
      document.documentElement.classList.remove("intro-active");
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("intro:done"));
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    if (reducedMotion()) {
      gsap.to(root.current, { opacity: 0, duration: 0.3, onComplete: finish });
      return;
    }
    gsap
      .timeline({ onComplete: finish })
      .to(q("[data-char]"), { yPercent: -110, opacity: 0, duration: 0.5, stagger: 0.015, ease: "power3.in" }, 0)
      .to(q("[data-fade], [data-chrome]"), { opacity: 0, duration: 0.3 }, 0)
      .to(q("[data-ring]"), { scale: 0.6, opacity: 0, duration: 0.4, ease: "power2.in" }, 0.05)
      .to(q("[data-orb]"), { scale: 70, duration: 1.0, ease: "power3.in" }, 0.25)
      .to(q("[data-orb]"), { opacity: 0, duration: 0.35 }, 0.95)
      .to(root.current, { opacity: 0, duration: 0.45, ease: "power1.out" }, 1.0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active() && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const [first, ...rest] = profile.name.toUpperCase().split(" ");
  const lines = [first, rest.join(" ")];

  return (
    <div
      ref={root}
      data-intro-screen
      role="dialog"
      aria-modal="true"
      aria-label={`${profile.name}, welcome`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ivory px-5 text-ink"
    >
      <div aria-hidden className="pointer-events-none absolute -left-[15vw] top-[10%] h-[70%] w-[40vw] rounded-full bg-[radial-gradient(closest-side,rgba(62,230,216,0.14),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -right-[15vw] bottom-0 h-[70%] w-[40vw] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.14),transparent)]" />

      <div data-chrome className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-5 py-6 md:px-10">
        <span className="display text-[1.15rem] tracking-[0.04em]">UK</span>
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink-muted">{profile.location}</span>
      </div>

      {/* Name: each letter rises in */}
      <h2 aria-label={profile.name} className="display text-center text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.95]">
        {lines.map((line, li) => (
          <span key={li} aria-hidden className="block overflow-hidden pb-[0.06em]">
            {line.split("").map((ch, ci) => (
              <span key={ci} data-char className={`inline-block ${li === 1 ? "text-gradient" : ""}`}>
                {ch === " " ? "\u00a0" : ch}
              </span>
            ))}
          </span>
        ))}
      </h2>

      {/* Role line that decodes through each role */}
      <p data-fade className="mt-6 flex h-[1.6em] items-center gap-3 text-[clamp(0.85rem,1.4vw,1.15rem)] font-semibold tracking-[0.2em] text-sky-deep">
        <span aria-hidden className="text-ink-muted">[</span>
        <span ref={roleEl} aria-live="off" className="tabular-nums">
          {ROLES[0].toUpperCase()}
        </span>
        <span aria-hidden className="text-ink-muted">]</span>
      </p>
      <p className="sr-only">{ROLES.join(", ")}</p>

      {/* Glowing ball inside a loading ring → ENTER */}
      <div className="relative mt-[6vh] grid place-items-center">
        <svg data-ring viewBox="0 0 120 120" className="size-[clamp(110px,11vw,140px)] -rotate-90" aria-hidden>
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - pct / 100)}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3ee6d8" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <button
          ref={button}
          type="button"
          onClick={enter}
          disabled={!ready}
          aria-label={ready ? "Enter the site" : `Loading, ${pct} percent`}
          className="group absolute inset-0 grid place-items-center rounded-full enabled:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3ee6d8]"
        >
          <span
            data-orb
            aria-hidden
            className="absolute size-5 rounded-full bg-[#efe6ff] shadow-[0_0_18px_6px_rgba(180,140,255,0.85),0_0_50px_14px_rgba(62,230,216,0.3)] transition-transform duration-300 group-enabled:group-hover:scale-125"
          />
          <span data-fade className="label-caps absolute top-[calc(100%+14px)] whitespace-nowrap text-[0.75rem] tabular-nums text-ink-soft">
            {ready ? "Enter →" : `${pct}%`}
          </span>
        </button>
      </div>
    </div>
  );
}
