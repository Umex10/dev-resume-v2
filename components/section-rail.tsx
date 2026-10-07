"use client";

import { useEffect, useState } from "react";
import { useActiveSection } from "@/lib/use-active-section";
import { useIsHome } from "@/lib/use-is-home";
import { SECTIONS } from "@/lib/sections";
import { cn } from "@/lib/utils";

/**
 * Fixed left rail (≥960px). Hidden until the first real scroll, fades out 3s after the last one.
 */
export function SectionRail() {
  const active = useActiveSection();
  const home = useIsHome();
  const [on, setOn] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastY = window.scrollY;
    const ping = () => {
      setOn(true);
      clearTimeout(timer);
      timer = setTimeout(() => setOn(false), 3000);
    };
    // Scroll anchoring fires scroll events without movement — only count real motion.
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 2) ping();
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!home) return null;
  return (
    <nav
      aria-label="Sections"
      data-visible={on}
      className={cn(
        "pointer-events-none fixed top-1/2 left-[clamp(14px,2vw,28px)] z-40 hidden flex-col gap-2.5 font-mono text-[10px] text-mute transition-[opacity,transform] duration-600 ease-reveal min-[960px]:flex",
        on ? "-translate-y-1/2 opacity-100" : "-translate-x-2.5 -translate-y-1/2 opacity-0",
      )}
    >
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          tabIndex={on ? 0 : -1}
          aria-current={active === i ? "true" : undefined}
          className={cn("flex items-center gap-2.5 py-0.5 text-mute", on ? "pointer-events-auto" : "pointer-events-none")}
        >
          <span
            className={cn("block h-px transition-[width] duration-500 ease-reveal", active === i ? "w-9 bg-acc" : "w-3.5 bg-mute")}
          />
          {/* Glass pill: the label floats over section text while scrolling. */}
          <span
            className={cn(
              "rounded-full border border-line bg-glass2 px-2 py-0.5 text-ink backdrop-blur-[12px] transition-opacity duration-400",
              active === i ? "opacity-100" : "opacity-0",
            )}
          >
            0{i + 1} {s.label.toLowerCase()}
          </span>
        </a>
      ))}
    </nav>
  );
}
