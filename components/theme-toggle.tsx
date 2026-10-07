"use client";

import { useTheme } from "next-themes";
import { switchTheme } from "@/lib/theme-transition";
import type { Theme } from "@/lib/accent";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={(e) => switchTheme(resolvedTheme === "light" ? "dark" : "light", setTheme as (t: Theme) => void, e.clientX, e.clientY)}
      className="grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-seg2 p-0 text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 1.5 A6.5 6.5 0 0 1 8 14.5 Z" fill="currentColor" />
      </svg>
    </button>
  );
}
