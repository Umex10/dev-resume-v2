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
 * The observer only tells us *that* something crossed the middle band; the answer is
 * re-measured each time, so out-of-order entries after fast jumps can't leave a stale value.
 */
export function useActiveSection(): number {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => setActive(measure());
    const io = new IntersectionObserver(update, { rootMargin: "-48% 0px -48% 0px" });
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    window.addEventListener("resize", update);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  return active;
}
