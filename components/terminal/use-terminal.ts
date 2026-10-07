"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { O, complete, run, type Effect, type Line } from "./commands";
import type { Theme } from "@/lib/accent";

const WELCOME: Line[] = [
  O("Welcome to ", ["umex10", "a"], " — zsh 5.9 (x86_64-linux-mint)"),
  O(["Type ", "m"], ["help", "a"], [" to see what I can do.", "m"]),
  { k: "out", s: [{ t: " ", c: "m" }] },
];

const MAX_LINES = 160;

export function useTerminal({ theme, onEffect }: { theme: Theme; onEffect: (e: Effect) => void }) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const hist = useRef<string[]>([]);
  const hIdx = useRef(-1);
  const typer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touched = useRef(false);
  const ctx = useRef({ theme, onEffect });
  useEffect(() => {
    ctx.current = { theme, onEffect };
  }, [theme, onEffect]);

  // "Last login" depends on the client clock — add it after hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only date
    setLines((l) => [O(["Last login: " + new Date().toDateString() + " on ttys001", "m"]), ...l]);
    return () => {
      clearInterval(typer.current);
      clearTimeout(pending.current);
    };
  }, []);

  /** Stops a command that is still being typed by a chip or the auto-run. */
  const cancelTyping = useCallback(() => {
    clearInterval(typer.current);
    clearTimeout(pending.current);
    setBusy(false);
  }, []);

  const exec = useCallback((raw: string) => {
    const res = run(raw, { history: hist.current, theme: ctx.current.theme, now: new Date() });
    const cmd = raw.trim();
    if (cmd) hist.current = [...hist.current, cmd];
    hIdx.current = -1;
    setInput("");
    setLines((l) => (res.clear ? [] : [...l, ...res.lines].slice(-MAX_LINES)));
    res.effects.forEach((e) => ctx.current.onEffect(e));
  }, []);

  /** Types a command character by character (50ms), then runs it. */
  const typeCmd = useCallback(
    (cmd: string, opts?: { auto?: boolean }) => {
      // The auto-run never overrides someone who already started typing.
      if (opts?.auto && touched.current) return;
      clearInterval(typer.current);
      clearTimeout(pending.current);
      setBusy(true);
      let i = 0;
      typer.current = setInterval(() => {
        i++;
        setInput(cmd.slice(0, i));
        if (i >= cmd.length) {
          clearInterval(typer.current);
          pending.current = setTimeout(() => {
            exec(cmd);
            setBusy(false);
          }, 260);
        }
      }, 50);
    },
    [exec],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const h = hist.current;
      touched.current = true;
      cancelTyping();
      if (e.key === "Enter") {
        e.preventDefault();
        exec(e.currentTarget.value);
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        if (!h.length) return;
        let i = hIdx.current < 0 ? h.length : hIdx.current;
        i = e.key === "ArrowUp" ? Math.max(0, i - 1) : i + 1;
        if (i >= h.length) {
          hIdx.current = -1;
          setInput("");
        } else {
          hIdx.current = i;
          setInput(h[i]);
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const r = complete(e.currentTarget.value);
        if (r.input) setInput(r.input);
        else if (r.list) setLines((l) => [...l, O([r.list!.join("   "), "m"])]);
      } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      }
    },
    [exec, cancelTyping],
  );

  const onInput = useCallback(
    (v: string) => {
      touched.current = true;
      cancelTyping();
      setInput(v);
    },
    [cancelTyping],
  );

  return { lines, input, onInput, busy, exec, typeCmd, onKeyDown };
}
