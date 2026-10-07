"use client";

import { useLenis } from "lenis/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { PROJECTS } from "@/content/projects";
import { DeepDiveHeader } from "./deep-dive-header";

const PANEL = [
  "z-91 glass-strong bg-glass2 gap-0 overflow-auto overscroll-contain rounded-[24px] p-0 text-ink",
  "backdrop-blur-[40px] backdrop-saturate-[180%]",
  "data-[side=right]:inset-y-[10px] data-[side=right]:right-[10px] data-[side=right]:h-auto",
  "data-[side=right]:w-[min(1080px,calc(100vw-20px))] data-[side=right]:sm:max-w-none data-[side=right]:border",
  "duration-700 ease-rise data-[side=right]:data-starting-style:translate-x-[60px] data-[side=right]:data-ending-style:translate-x-[60px]",
].join(" ");

/** Deep dive as a Sheet over the page (intercepted route). Closing goes back in history. */
export function DeepDiveSheet({ id, children }: { id: string; children: ReactNode }) {
  const router = useRouter();
  const lenis = useLenis();
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const name = PROJECTS.find((p) => p.id === id)?.name ?? "Project";

  // Next.js keeps visited routes alive in a hidden <Activity>. Activity runs layout-effect cleanups
  // when hiding and re-runs the effects when revealing, so that lifecycle tells us whether this
  // route is visible. While hidden the Sheet is unmounted: closing it inside display:none never
  // finishes its exit animation and leaves Base UI stuck, so each reveal mounts a fresh one.
  // The fresh mount may suspend; the inner <Suspense> keeps that from hiding this component too,
  // which would run the same cleanup and loop.
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with Activity visibility
    setHidden(false);
    return () => {
      setHidden(true);
      setClosing(false);
    };
  }, []);
  const close = () => setClosing(true);

  // Freeze smooth scroll underneath while the sheet is up.
  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  // prev / next keep the Sheet mounted — start each project at the top.
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [id]);

  if (hidden) return null;

  return (
    <Suspense>
      <Sheet
        open={!closing}
        onOpenChange={(o) => !o && close()}
        onOpenChangeComplete={(o) => {
          if (!o && closing) router.back();
        }}
      >
        <SheetContent
          ref={panel}
          side="right"
          showCloseButton={false}
          data-lenis-prevent
          data-testid="deep-dive"
          className={PANEL}
          overlayClassName="z-90 bg-[rgba(4,6,10,.45)] backdrop-blur-[8px] duration-450"
        >
          <SheetTitle className="sr-only">{name} — deep dive</SheetTitle>
          <DeepDiveHeader id={id} mode="sheet" onClose={close} />
          {children}
        </SheetContent>
      </Sheet>
    </Suspense>
  );
}
