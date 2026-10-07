"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "./sections";

/** Index of the section crossing the vertical middle of the viewport. */
function measure(): number {
  const mid = window.innerHeight / 2;
  const i = SECTIONS.findIndex((s) => {
    const r = document.getElementById(s.id)?.getBoundingClientRect();
    return !!r && r.top <= mid && r.bottom > mid;
  });
  return Math.max(0, i);
}

/**
 * Re-measured on scroll (once per frame) rather than with an IntersectionObserver: the callers live
 * in the layout and mount before the streamed page is swapped in, so the sections may not exist yet.
 */
export function useActiveSection(): number {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(measure()));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return active;
}
