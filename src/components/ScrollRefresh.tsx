"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/motion";

/** Recalculate every ScrollTrigger once fonts and images settle, so pinned scenes measure correctly. */
export function ScrollRefresh() {
  useEffect(() => {
    ScrollTrigger.sort();
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 600);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);
  return null;
}
