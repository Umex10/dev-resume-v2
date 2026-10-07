"use client";

import { useLenis } from "lenis/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Reveal } from "@/components/reveal";
import { useSite } from "@/components/site-provider";
import { CHIPS, EMAIL, GITHUB } from "@/content/terminal";
import type { Theme } from "@/lib/accent";
import { switchTheme } from "@/lib/theme-transition";
import type { Effect } from "./commands";
import { Terminal, type TerminalHandle } from "./terminal";
import { useTerminal } from "./use-terminal";

export function Shell({ streak }: { streak: number }) {
  const router = useRouter();
  const lenis = useLenis();
  const { resolvedTheme, setTheme } = useTheme();
  const { accent, setAccent, setPrompt } = useSite();
  const term = useRef<TerminalHandle>(null);
  const section = useRef<HTMLElement>(null);
  const theme: Theme = resolvedTheme === "light" ? "light" : "dark";

  const onEffect = useCallback(
    (e: Effect) => {
      switch (e.type) {
        case "open":
          return void setTimeout(() => router.push(`/work/${e.id}`, { scroll: false }), 420);
        case "theme":
          return void setTimeout(() => switchTheme(e.value, setTheme as (t: Theme) => void), 200);
        case "accent":
          return setAccent(e.value);
        case "prompt":
          return setPrompt(e.value);
        case "github":
          return void window.open(GITHUB, "_blank", "noopener");
        case "mail":
          return void setTimeout(() => (window.location.href = `mailto:${EMAIL}?subject=Let%27s%20work%20together`), 900);
      }
    },
    [router, setTheme, setAccent, setPrompt],
  );

  const t = useTerminal({ theme, onEffect });

  /** If the terminal is not fully visible, centre it so the result of a chip is always seen. */
  const revealTerminal = () => {
    const box = term.current?.box;
    if (!box) return;
    const b = box.getBoundingClientRect();
    if (b.top >= 70 && b.bottom <= window.innerHeight - 10) return;
    const target = window.scrollY + b.top - Math.max(80, (window.innerHeight - b.height) / 2);
    if (lenis) lenis.scrollTo(target, { duration: 0.9 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  // First time the section enters the viewport: type `neofetch`, without moving the page.
  const { typeCmd } = t;
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timer = setTimeout(() => typeCmd("neofetch", { auto: true }), 800);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [typeCmd]);

  return (
    <section
      ref={section}
      id="shell"
      aria-labelledby="shell-title"
      className="section-pad relative box-border flex min-h-svh flex-wrap items-center gap-[clamp(40px,6vw,96px)] overflow-hidden"
    >
      <Reveal className="flex max-w-[440px] flex-[1_1_300px] flex-col gap-[22px]">
        <span className="font-mono text-[11px] text-acc">02 / shell</span>
        <h2 id="shell-title" className="h2-display">
          Ask the terminal.
        </h2>
        <p className="m-0 text-base leading-[1.6] text-pretty text-mute">
          A zsh that knows me. Run a command, open a project, or change the prompt and accent from the gear icon — the
          whole site follows along.
        </p>
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip) => {
            // Once orange is on, the chip offers the way back.
            const c = chip === "accent orange" && accent === "orange" ? "accent violet" : chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  revealTerminal();
                  t.typeCmd(c);
                }}
                className="glass-chip cursor-pointer rounded-full px-[13px] py-[9px] font-mono text-[11.5px] text-ink transition-colors duration-200 hover:border-acc hover:text-acc"
              >
                <span className="text-acc">$</span> {c}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[10.5px] text-mute">tab completes · ↑↓ history · ctrl+l clears</span>
      </Reveal>
      <Terminal ref={term} lines={t.lines} input={t.input} onInput={t.onInput} onKeyDown={t.onKeyDown} streak={streak} />
    </section>
  );
}
