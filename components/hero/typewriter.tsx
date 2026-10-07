"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/site-provider";
import { ROLES } from "@/content/terminal";

/** The "-er" suffix is the joke — it is rendered separately in --acc2, italic. */
export function splitRole(typed: string, word: string): [string, string] {
  const cut = word.length - 2;
  return [typed.slice(0, cut), typed.slice(cut)];
}

const TYPE = 90;
const HOLD = 1800;
const DELETE = 42;

export function Typewriter() {
  const { revealed, reduced } = useSite();
  const [wi, setWi] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!revealed || reduced) return;
    let w = 0;
    let c = 0;
    let del = false;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      const word = ROLES[w].w;
      setWi(w);
      if (!del) {
        c++;
        setTyped(word.slice(0, c));
        if (c === word.length) {
          del = true;
          t = setTimeout(step, HOLD);
          return;
        }
        t = setTimeout(step, TYPE);
      } else {
        c--;
        setTyped(word.slice(0, c));
        if (c === 0) {
          del = false;
          w = (w + 1) % ROLES.length;
          t = setTimeout(step, 320);
          return;
        }
        t = setTimeout(step, DELETE);
      }
    };
    t = setTimeout(step, 400);
    return () => clearTimeout(t);
  }, [revealed, reduced]);

  const base = "wdth-100 flex flex-wrap items-center gap-x-[.25em] text-[clamp(26px,3.4vw,54px)] leading-none font-light tracking-[-0.03em]";

  if (reduced) {
    return (
      <div className={base}>
        {["Backender", "Frontender", "CI/CDer"].map((w, i) => {
          const [a, b] = splitRole(w, w);
          return (
            <span key={w} className="font-medium">
              {i > 0 && <span className="text-mute"> · </span>}
              <span className="text-acc">{a}</span>
              <span className="text-acc2 italic">{b}</span>
            </span>
          );
        })}
      </div>
    );
  }

  const role = ROLES[wi];
  const [a, b] = splitRole(typed, role.w);
  const full = typed === role.w;
  return (
    <div className={base} aria-label={ROLES.map((r) => r.w).join(", ")}>
      <span className="inline-flex items-center" aria-hidden="true">
        <span className="font-medium text-acc">{a}</span>
        <span className="font-medium text-acc2 italic">{b}</span>
        <span className="ml-[.04em] inline-block h-[.9em] w-[.08em] animate-[blink_1s_steps(1)_infinite] bg-acc" />
      </span>
      <span
        aria-hidden="true"
        className="ml-[.6em] self-center font-mono text-[clamp(11px,.85vw,13px)] tracking-normal text-mute transition-[opacity,transform] duration-400 ease-reveal"
        style={{ opacity: full ? 1 : 0, transform: full ? "none" : "translateY(6px)" }}
      >
        {role.n}
      </span>
    </div>
  );
}
