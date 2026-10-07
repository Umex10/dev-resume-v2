"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, type KeyboardEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSite } from "@/components/site-provider";
import type { Line } from "./commands";
import { OutputLine } from "./output";
import { Prompt } from "./prompt";
import { GearHint } from "./gear-hint";
import { TerminalSettings } from "./settings";
import { ZshrcGhost } from "./zshrc-ghost";

type Props = {
  lines: Line[];
  input: string;
  onInput: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  streak: number;
  tilt?: number;
};

export type TerminalHandle = { box: HTMLDivElement | null; stick: () => void };

export const Terminal = forwardRef<TerminalHandle, Props>(function Terminal(
  { lines, input, onInput, onKeyDown, streak, tilt = 18 },
  handle,
) {
  const { prompt, accent, fontSize, flat, reduced } = useSite();
  const box = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stickNow = useCallback(() => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  useImperativeHandle(handle, () => ({
    get box() {
      return box.current;
    },
    stick: stickNow,
  }), [stickNow]);

  // Keep the newest output in view: now, after 140ms, after 500ms (late layout like neofetch's image).
  useEffect(() => {
    stickNow();
    const t = [140, 500].map((ms) => setTimeout(() => body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" }), ms));
    return () => t.forEach(clearTimeout);
  }, [lines, stickNow]);
  useEffect(() => {
    stickNow();
  }, [input, stickNow]);
  useEffect(() => {
    if (!content.current) return;
    const ro = new ResizeObserver(stickNow);
    ro.observe(content.current);
    return () => ro.disconnect();
  }, [stickNow]);

  // 3D tilt follows the pointer across the section (±8° Y, ±6° X), ×0.45 below 700px.
  useEffect(() => {
    const el = box.current;
    const section = el?.closest("section");
    if (!el || !section) return;
    const apply = (mx = 0, my = 0) => {
      if (flat || reduced) return void (el.style.transform = "none");
      const k = window.innerWidth < 700 ? 0.45 : 1;
      el.style.transform = `rotateX(${(9 - my * 6) * k}deg) rotateY(${(-tilt + mx * 8) * k}deg) rotateZ(${1.5 * k}deg)`;
    };
    apply();
    const onMove = (e: PointerEvent) => e.pointerType === "mouse" && apply(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    const onResize = () => apply();
    section.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      section.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [flat, reduced, tilt]);

  return (
    <div className="relative min-w-0 flex-[3_1_520px] perspective-[1700px]">
      <div ref={box} data-testid="terminal" className="relative origin-[40%_50%] transition-transform duration-900 ease-reveal">
        <div aria-hidden="true" className="absolute inset-x-[8%] -bottom-[70px] h-20 rounded-[50%] bg-acc opacity-[.22] blur-[50px]" />
        <ZshrcGhost />
        <GearHint />
        <div className="glass-strong relative flex h-[440px] flex-col overflow-hidden rounded-2xl min-[700px]:h-[clamp(440px,64vh,620px)]">
          <div className="flex h-[42px] flex-none items-center gap-3.5 border-b border-line px-3.5 font-mono text-[11px] text-mute">
            <div className="flex gap-[7px]" aria-hidden="true">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="flex-1 truncate text-center">umejr@graz — ~/dev-resume — zsh</span>
            <TerminalSettings />
          </div>
          <ScrollArea
            className="min-h-0 flex-1"
            viewportRef={body}
            viewportClassName="cursor-text"
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
          >
            <div
              ref={content}
              className="px-5 pt-4 pb-2.5 font-mono leading-[1.7] text-ink"
              style={{ fontSize }}
            >
              <div role="log" aria-live="polite" aria-label="Terminal output" data-testid="terminal-log">
                {lines.map((l, i) => (
                  <OutputLine key={i} line={l} prompt={prompt} streak={streak} />
                ))}
              </div>
              <div className="flex flex-wrap items-center">
                <Prompt theme={prompt} />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => onInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  aria-label="Terminal input"
                  className="min-w-20 flex-1 border-0 bg-transparent p-0 font-[inherit] text-ink caret-acc outline-none focus-visible:outline-none"
                />
              </div>
            </div>
          </ScrollArea>
          <div className="flex h-7 flex-none items-center justify-between gap-3 border-t border-line px-3.5 font-mono text-[10px] text-mute">
            <span>zsh 5.9 · utf-8 · {prompt}</span>
            <span>
              <span className="text-acc">●</span> {accent} · {lines.length} lines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
