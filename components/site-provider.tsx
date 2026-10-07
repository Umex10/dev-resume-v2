"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ACCENT_KEY, HUES, isAccent, type Accent } from "@/lib/accent";
import { FONT_SIZES, PROMPTS, type FontSize, type PromptTheme } from "@/content/terminal";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Site = {
  accent: Accent;
  setAccent: (a: Accent) => void;
  prompt: PromptTheme;
  setPrompt: (p: PromptTheme) => void;
  fontSize: FontSize;
  setFontSize: (f: FontSize) => void;
  flat: boolean;
  setFlat: (f: boolean) => void;
  reduced: boolean;
  /** Hero has been revealed (opener finished or skipped) */
  revealed: boolean;
  reveal: () => void;
  /** Increments when "↻ replay intro" is pressed */
  introRun: number;
  replayIntro: () => void;
};

const SiteContext = createContext<Site | null>(null);

const LS = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* private mode */
    }
  },
};

export function SiteProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [accent, setAccentState] = useState<Accent>("violet");
  const [prompt, setPromptState] = useState<PromptTheme>("arrow");
  const [fontSize, setFontSizeState] = useState<FontSize>(13);
  const [flat, setFlatState] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [introRun, setIntroRun] = useState(0);

  // Hydrate persisted settings once on the client.
  useEffect(() => {
    const a = LS.get(ACCENT_KEY);
    const p = LS.get("umex-prompt");
    const f = Number(LS.get("umex-fs"));
    /* eslint-disable react-hooks/set-state-in-effect -- reading browser-only storage after hydration */
    if (isAccent(a)) setAccentState(a);
    if ((PROMPTS as readonly string[]).includes(p ?? "")) setPromptState(p as PromptTheme);
    if (FONT_SIZES.some((s) => s.v === f)) setFontSizeState(f as FontSize);
    if (LS.get("umex-tilt") === "off") setFlatState(true);
    if (document.documentElement.dataset.revealed !== undefined) setRevealed(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setAccent = useCallback((a: Accent) => {
    document.documentElement.style.setProperty("--accH", String(HUES[a]));
    LS.set(ACCENT_KEY, a);
    setAccentState(a);
  }, []);
  const setPrompt = useCallback((p: PromptTheme) => {
    LS.set("umex-prompt", p);
    setPromptState(p);
  }, []);
  const setFontSize = useCallback((f: FontSize) => {
    LS.set("umex-fs", String(f));
    setFontSizeState(f);
  }, []);
  const setFlat = useCallback((f: boolean) => {
    LS.set("umex-tilt", f ? "off" : "on");
    setFlatState(f);
  }, []);
  const reveal = useCallback(() => {
    document.documentElement.dataset.revealed = "";
    setRevealed(true);
  }, []);
  const replayIntro = useCallback(() => {
    delete document.documentElement.dataset.revealed;
    document.documentElement.dataset.opener = "show";
    setRevealed(false);
    setIntroRun((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ accent, setAccent, prompt, setPrompt, fontSize, setFontSize, flat, setFlat, reduced, revealed, reveal, introRun, replayIntro }),
    [accent, setAccent, prompt, setPrompt, fontSize, setFontSize, flat, setFlat, reduced, revealed, reveal, introRun, replayIntro],
  );
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): Site {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
