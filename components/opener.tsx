"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSite } from "@/components/site-provider";
import { BOOT_LINES } from "@/content/terminal";
import { INTRO_KEY } from "@/lib/boot-script";

type Phase = "run" | "leave" | "gone";

const DURATION = 1900;

export function OpenerScreen({ pct, lines, leaving }: { pct: number; lines: string[]; leaving: boolean }) {
  return (
    <div
      className="opener fixed inset-0 z-200 flex flex-col justify-between bg-bg p-[clamp(20px,4vw,48px)] font-mono text-[11px] tracking-[0.02em] text-mute transition-transform duration-1100 ease-curtain"
      style={{ transform: leaving ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div className="flex justify-between gap-4">
        <span>umejr.dev / dev-resume v2</span>
        <span>graz, at</span>
      </div>
      <div className="flex max-w-[420px] flex-col gap-2" aria-live="polite">
        {lines.map((l) => (
          <div key={l} className="flex gap-3.5">
            <span className="text-acc">ok</span>
            <span className="text-ink">{l}</span>
          </div>
        ))}
      </div>
      <div className="flex items-end justify-between gap-5">
        <div className="wdth-125 font-sans text-[clamp(30px,5vw,76px)] leading-[.8] font-extrabold tracking-[-0.05em] text-ink">
          umex10<span className="text-acc">.</span>
        </div>
        <div className="wdth-62 font-sans text-[clamp(96px,24vw,360px)] leading-[.76] font-extralight tracking-[-0.02em] text-ink tabular-nums">
          {String(Math.floor(pct)).padStart(3, "0")}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 bg-acc transition-[width] duration-200" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Boot overlay: once per session (and on hard reload of "/"). Click or Esc skips it. */
export function Opener() {
  const { reveal, introRun } = useSite();
  const [phase, setPhase] = useState<Phase>("run");
  const [pct, setPct] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finishing = useRef(false);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const finish = useCallback(() => {
    if (finishing.current) return;
    finishing.current = true;
    clear();
    setPct(100);
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    at(260, () => setPhase("leave"));
    at(650, reveal);
    at(1500, () => {
      setPhase("gone");
      document.documentElement.dataset.opener = "done";
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        /* private mode */
      }
    });
  }, [reveal]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- the boot script decided before hydration */
    if (document.documentElement.dataset.opener !== "show") {
      setPhase("gone");
      return;
    }
    finishing.current = false;
    setPhase("run");
    setPct(0);
    /* eslint-enable react-hooks/set-state-in-effect */
    // Irregular steps, but bounded by wall time so a busy main thread can't stretch it past ~1.9s.
    let p = 0;
    const t0 = performance.now();
    const step = () => {
      p = Math.min(100, Math.max(p + 1.5 + Math.random() * 3.6, ((performance.now() - t0) / DURATION) * 100));
      setPct(p);
      if (p >= 100) finish();
      else timers.current.push(setTimeout(step, 55));
    };
    timers.current.push(setTimeout(step, 55));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      clear();
      window.removeEventListener("keydown", onKey);
    };
  }, [introRun, finish]);

  if (phase === "gone") return null;
  const lines = BOOT_LINES.slice(0, Math.ceil(pct / (100 / BOOT_LINES.length)));
  return (
    <div onClick={finish} data-testid="opener" data-phase={phase} className="contents">
      <OpenerScreen pct={pct} lines={lines} leaving={phase === "leave"} />
      <button type="button" onClick={finish} className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:z-210">
        skip intro
      </button>
    </div>
  );
}
