"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { CloseIcon, MenuIcon } from "./ui/Icons";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 160);
          last = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section highlight: the last section whose top has passed 45% of the viewport.
  // (Position-based rather than IntersectionObserver because the About anchor lives inside a sticky scene.)
  useEffect(() => {
    const ids = ["home", ...LINKS.map((l) => l.id)];
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom, the last section is active even if short
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1];
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Mobile menu: lock scroll, focus trap, Escape to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a,button") ?? []).filter((el) => !el.hasAttribute("disabled"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#about"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`transition-[background-color,border-color] duration-500 ${
            scrolled || open ? "border-b border-white/[0.07] bg-[rgba(8,10,16,0.72)] backdrop-blur-xl" : "border-b border-transparent"
          }`}
        >
          <nav aria-label="Primary" className="mx-auto grid h-[72px] w-full max-w-[1400px] grid-cols-[1fr_auto] items-center gap-6 px-5 md:px-10 lg:grid-cols-[1fr_auto_1fr]">
            <a href="#home" className="display w-fit text-[1.15rem] tracking-[0.04em] text-ink" aria-label={`UK ${profile.name}, home`}>
              UK
            </a>

            <a
              href={`mailto:${profile.links.email}`}
              className="hidden text-[0.95rem] tracking-[0.06em] text-ink-soft transition-colors hover:text-ink lg:block"
            >
              {profile.links.email}
            </a>

            <ul className="hidden items-center justify-end gap-1 md:flex">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`label-caps relative px-3 py-2 text-[0.72rem] transition-colors duration-300 xl:px-4 ${
                      active === l.id ? "text-ink" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {l.label}
                    {active === l.id && <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-px bg-sky-deep xl:inset-x-4" />}
                  </a>
                </li>
              ))}
            </ul>

            <button
              ref={toggleRef}
              type="button"
              className="grid size-10 place-items-center justify-self-end text-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </nav>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-[rgba(8,10,16,0.97)] px-6 pt-28 backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {LINKS.map((l, i) => (
            <li key={l.id} className="rm-fade" style={{ animationDelay: `${i * 40}ms` }}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="display block py-2.5 text-[2rem] uppercase text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={`mailto:${profile.links.email}`} onClick={() => setOpen(false)} className="mt-10 inline-block text-lg text-ink-soft underline underline-offset-4">
          {profile.links.email}
        </a>
      </div>
    </>
  );
}
