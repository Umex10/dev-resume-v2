import Link from "next/link";
import { PROJECTS, previewUrl } from "@/content/projects";
import { Shot } from "./shot";

/** Glass browser window: url pill, crossfading screenshot, tagline, stack, deep-dive button. */
export function PreviewWindow({ active }: { active: number }) {
  const p = PROJECTS[active];
  return (
    <div className="overflow-hidden rounded-[18px] border border-line bg-glass shadow-[inset_0_1px_0_var(--hi),0_50px_100px_-40px_var(--shadow)] backdrop-blur-[26px] backdrop-saturate-[170%]">
      <div className="flex h-10 items-center gap-3 border-b border-line px-3.5">
        <div className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-seg" />
          ))}
        </div>
        <span className="flex-1 truncate rounded-[7px] bg-seg2 px-2.5 py-[5px] text-center font-mono text-[10.5px] text-mute">
          {previewUrl(p)}
        </span>
      </div>
      <div className="relative aspect-16/10 bg-seg2">
        {PROJECTS.map((q, i) => (
          <div
            key={q.id}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Shot project={q} sizes="(min-width: 960px) 45vw, 92vw" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 p-5">
        <p className="m-0 text-[17px] leading-[1.45] text-pretty">{p.tagline}</p>
        <div className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, 7).map((t) => (
            <span key={t} className="rounded-full border border-line px-[9px] py-[5px] font-mono text-[10.5px] text-mute">
              {t}
            </span>
          ))}
        </div>
        <Link
          href={`/work/${p.id}`}
          scroll={false}
          className="flex items-center gap-2.5 self-start rounded-full bg-ink px-4 py-[11px] font-mono text-[11.5px] text-bg hover:text-bg"
        >
          Open deep dive <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
