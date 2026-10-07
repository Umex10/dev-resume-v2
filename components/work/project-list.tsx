import Link from "next/link";
import { PROJECTS } from "@/content/projects";
import { cn } from "@/lib/utils";

/** Big project rows. Hover/focus sets the active project; each row is a real link to the deep dive. */
export function ProjectList({ active, onActive, more }: { active: number; onActive: (i: number) => void; more: number }) {
  return (
    <div className="flex min-w-0 flex-[1_1_440px] flex-col">
      {PROJECTS.map((p, i) => {
        const on = active === i;
        return (
          <Link
            key={p.id}
            href={`/work/${p.id}`}
            scroll={false}
            onMouseEnter={() => onActive(i)}
            onFocus={() => onActive(i)}
            data-active={on}
            className={cn(
              "grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 border-t border-line py-6 text-ink transition-[opacity,padding] duration-500 ease-reveal hover:text-ink",
              on ? "pl-[18px] opacity-100" : "pl-0 opacity-40",
            )}
          >
            <span className="font-mono text-[11px] text-acc">{p.no}</span>
            <span className="flex min-w-0 flex-col gap-2">
              <span className="wdth-112 text-[clamp(30px,4vw,60px)] leading-[.95] font-bold tracking-[-0.04em]">{p.name}</span>
              <span className="font-mono text-[10.5px] tracking-[.04em] text-mute uppercase">
                {p.kind} · {p.stack.slice(0, 3).join(" · ")}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "grid size-11 place-items-center rounded-full border border-line text-base transition-colors duration-300",
                on ? "bg-acc text-[#05070a]" : "bg-transparent text-ink",
              )}
            >
              ↗
            </span>
          </Link>
        );
      })}
      <a
        href="https://github.com/Umex10?tab=repositories"
        target="_blank"
        rel="noreferrer"
        className="flex justify-between gap-4 border-y border-line py-[22px] font-mono text-[11px] text-mute"
      >
        <span>+{more} more — smart-kassa, task-manager, dsa-exercises …</span>
        <span className="whitespace-nowrap text-ink">all repositories ↗</span>
      </a>
    </div>
  );
}
