"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PROJECTS, projectIndex } from "@/content/projects";

const ROUND = "grid size-[34px] place-items-center rounded-full border border-line bg-transparent text-ink cursor-pointer";

/**
 * Sticky header: "NN / kind", ← → between projects, close.
 * In the Sheet, prev/next replace the intercepted route so "back" still closes it.
 */
export function DeepDiveHeader({ id, mode, onClose }: { id: string; mode: "sheet" | "page"; onClose?: () => void }) {
  const router = useRouter();
  const i = projectIndex(id);
  const p = PROJECTS[i];
  const prev = PROJECTS[(i + PROJECTS.length - 1) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const go = (slug: string) => router.replace(`/work/${slug}`, { scroll: false });

  return (
    <div className="sticky top-0 z-2 flex items-center justify-between gap-3 border-b border-line bg-glass2 px-[clamp(18px,3vw,32px)] py-3.5 font-mono text-[11px] text-mute backdrop-blur-[30px]">
      <span>
        <span className="text-acc">{p.no}</span> / {p.kind}
      </span>
      <div className="flex gap-1.5">
        {mode === "sheet" ? (
          <>
            <button type="button" aria-label="Previous project" className={ROUND} onClick={() => go(prev.id)}>
              ←
            </button>
            <button type="button" aria-label="Next project" className={ROUND} onClick={() => go(next.id)}>
              →
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-[34px] cursor-pointer rounded-full border-0 bg-ink px-3.5 font-[inherit] whitespace-nowrap text-bg"
            >
              close · esc
            </button>
          </>
        ) : (
          <>
            <Link aria-label="Previous project" className={ROUND} href={`/work/${prev.id}`}>
              ←
            </Link>
            <Link aria-label="Next project" className={ROUND} href={`/work/${next.id}`}>
              →
            </Link>
            <Link href="/#work" className="grid h-[34px] place-items-center rounded-full bg-ink px-3.5 whitespace-nowrap text-bg hover:text-bg">
              close
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
