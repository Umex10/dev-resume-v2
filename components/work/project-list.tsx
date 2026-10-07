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
              "grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 border-t border-line py-6 text-ink transition-[opacity,padding] duration-500 ease-reveal hover:text-ink max-[700px]:grid-cols-[28px_minmax(0,1fr)_auto] max-[700px]:gap-3 max-[700px]:py-5",
              // No preview below 1024px, so no hover state: every row stays fully visible.
              on ? "pl-[18px] opacity-100 max-[1024px]:pl-0" : "pl-0 opacity-40 max-[1024px]:opacity-100",
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
                on ? "bg-acc text-[#05070a] max-[1024px]:bg-transparent max-[1024px]:text-ink" : "bg-transparent text-ink",
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
        className="flex justify-between gap-4 border-y border-line py-[22px] font-mono text-[11px] text-mute max-[700px]:flex-col max-[700px]:gap-2.5"
      >
        <span>+{more} more — smart-kassa, task-manager, dsa-exercises …</span>
        <span className="whitespace-nowrap text-ink">all repositories ↗</span>
      </a>
    </div>
  );
}
