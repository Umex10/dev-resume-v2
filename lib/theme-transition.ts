"use client";

import { flushSync } from "react-dom";
import type { Theme } from "./accent";

/**
 * Switches theme with a circular clip-path wipe from (x, y) via the View Transitions API.
 * Falls back to an instant switch.
 */
export function switchTheme(next: Theme, setTheme: (t: Theme) => void, x?: number, y?: number) {
  const apply = () => {
    const d = document.documentElement;
    d.dataset.theme = next;
    d.style.colorScheme = next;
    flushSync(() => setTheme(next));
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) return apply();
  const cx = x ?? window.innerWidth - 60;
  const cy = y ?? 30;
  const r = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
  document.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${r}px at ${cx}px ${cy}px)`] },
      { duration: 750, easing: "cubic-bezier(.7,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}
