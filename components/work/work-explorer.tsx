"use client";

import { useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { PreviewWindow } from "./preview-window";
import { ProjectList } from "./project-list";

/** List on the left, sticky preview on the right. The code flashlight lives only behind the preview. */
export function WorkExplorer({ flashlight, more }: { flashlight: ReactNode; more: number }) {
  const [active, setActive] = useState(0);
  const code = useRef<HTMLDivElement>(null);

  // Update the mask position through CSS variables — no re-render per pointer move.
  const onMove = (e: React.PointerEvent) => {
    const el = code.current;
    if (!el || e.pointerType !== "mouse") return;
    const b = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - b.left}px`);
    el.style.setProperty("--my", `${e.clientY - b.top}px`);
  };

  return (
    <div className="flex flex-wrap items-start gap-[clamp(32px,4vw,64px)]">
      <Reveal className="flex min-w-0 flex-[1_1_440px]">
        <ProjectList active={active} onActive={setActive} more={more} />
      </Reveal>
      <div onPointerMove={onMove} className="relative isolate min-w-0 flex-[1_1_420px] min-[960px]:sticky min-[960px]:top-24">
        <div
          ref={code}
          aria-hidden="true"
          className="flashlight pointer-events-none absolute -top-[70px] -right-[14vw] -bottom-[110px] -left-10 -z-1 overflow-hidden"
        >
          {flashlight}
        </div>
        <Reveal>
          <PreviewWindow active={active} />
        </Reveal>
      </div>
    </div>
  );
}
