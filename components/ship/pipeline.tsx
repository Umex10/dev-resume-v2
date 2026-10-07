"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/site-provider";
import { PIPELINE } from "@/content/pipeline";
import { cn } from "@/lib/utils";

type Run = { number: number; total: string; failed: boolean };

function StageIcon({ state }: { state: "done" | "run" | "wait" }) {
  if (state === "done")
    return <span className="grid size-[30px] flex-none place-items-center rounded-full bg-acc text-sm font-bold text-[#05070a]">✓</span>;
  if (state === "run")
    return <span className="box-border size-[30px] flex-none animate-[spin_.8s_linear_infinite] rounded-full border-2 border-seg border-t-acc" />;
  return <span className="box-border size-[30px] flex-none rounded-full border border-dashed border-mute" />;
}

/** push → test → build → docker → publish → deploy. Starts on first view, 950ms per stage. */
export function Pipeline({ run }: { run: Run }) {
  const { reduced } = useSite();
  const [pipe, setPipe] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const start = () => {
    clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setPipe(PIPELINE.length);
    let n = 0;
    setPipe(0);
    timer.current = setInterval(() => {
      n++;
      setPipe(n);
      if (n >= PIPELINE.length) clearInterval(timer.current);
    }, 950);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      t = setTimeout(start, 500);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
      clearInterval(timer.current);
    };
  }, []);

  const shown = reduced && pipe < 0 ? PIPELINE.length : pipe;
  const passed = shown >= PIPELINE.length;
  const status = passed ? `${run.failed ? "failed" : "passed"} · ${run.total}` : shown < 0 ? "queued" : `running · ${PIPELINE[shown].n}`;

  return (
    <div ref={ref} data-testid="pipeline" className="glass overflow-hidden rounded-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 font-mono text-[11px] text-mute">
        <span>
          ci · <span className="text-ink">main</span> · run #{run.number} · authkit
        </span>
        <div className="flex items-center gap-3">
          <span aria-live="polite" className={passed ? (run.failed ? "text-acc2" : "text-ok") : "text-acc"}>
            ● {status}
          </span>
          <button type="button" onClick={start} className="cursor-pointer rounded-full border border-line bg-transparent px-3 py-[7px] font-[inherit] text-ink">
            ↻ re-run
          </button>
        </div>
      </div>
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-y-6 px-5 pt-[26px] pb-6">
        {PIPELINE.map((p, i) => {
          const state = i < shown ? "done" : i === shown ? "run" : "wait";
          return (
            <li key={p.n} className={cn("flex flex-col gap-3 transition-opacity duration-400", state === "wait" ? "opacity-45" : "opacity-100")}>
              <div className="flex items-center">
                <StageIcon state={state} />
                <div className="mx-2.5 h-0.5 flex-1 overflow-hidden bg-seg">
                  <div
                    className="h-full bg-acc transition-[width] duration-900 ease-[cubic-bezier(.4,0,.2,1)]"
                    style={{ width: state === "done" ? "100%" : "0%" }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 pr-4">
                <span className="wdth-112 text-[22px] font-bold tracking-[-0.03em]">{p.n}</span>
                <span className="font-mono text-[10.5px] text-mute">{p.sub}</span>
                <span className="font-mono text-[10.5px] text-acc">{state === "done" ? p.t : state === "run" ? "running" : "queued"}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
