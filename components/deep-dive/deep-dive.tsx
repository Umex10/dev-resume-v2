import { Shot } from "@/components/work/shot";
import { repoUrl } from "@/content/projects";
import type { Project } from "@/content/types";
import { highlightFiles } from "@/lib/highlight";
import { ArchFlow } from "./arch-flow";
import { FileTabs } from "./file-tabs";

const Label = ({ children }: { children: string }) => <span className="font-mono text-[10.5px] text-acc">{children}</span>;

/** The deep-dive body, shared by the Sheet (intercepted route) and the standalone page. */
export async function DeepDive({ project: p }: { project: Project }) {
  const files = await highlightFiles(p.files);
  return (
    <div className="flex flex-col gap-[clamp(36px,5vw,56px)] p-[clamp(24px,4vw,48px)]">
      <div className="flex flex-col gap-[18px]">
        <h1 className="wdth-125 m-0 text-[clamp(56px,9vw,136px)] leading-[.82] font-extrabold tracking-[-0.055em]">{p.name}</h1>
        <p className="m-0 max-w-[34ch] text-[clamp(18px,1.8vw,24px)] leading-[1.35] text-pretty text-mute">{p.tagline}</p>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-seg2">
        <Shot project={p} sizes="(min-width: 1100px) 1000px, 94vw" priority />
      </div>
      <div className="flex flex-wrap gap-10">
        <div className="flex flex-[1_1_320px] flex-col gap-3.5">
          <Label>overview</Label>
          <p className="m-0 text-[17px] leading-[1.6] text-pretty">{p.overview}</p>
        </div>
        <div className="flex flex-[1_1_360px] flex-col gap-3.5">
          <Label>highlights</Label>
          <ol className="m-0 flex list-none flex-col p-0">
            {p.highlights.map((h, i) => (
              <li key={h} className="grid grid-cols-[32px_minmax(0,1fr)] gap-2.5 border-t border-line py-3 text-[15px] leading-normal">
                <span className="pt-[3px] font-mono text-[10.5px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span>{h}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label>how it fits together</Label>
        <ArchFlow steps={p.arch} />
      </div>
      <div className="flex flex-col gap-3.5">
        <Label>key files</Label>
        <FileTabs files={files} className="bg-seg2" codeClassName="max-h-[460px]" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <ul className="m-0 flex max-w-[640px] list-none flex-wrap gap-1.5 p-0">
          {p.stack.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-1.5 font-mono text-[10.5px]">
              {t}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          {p.repo && (
            <a
              href={repoUrl(p)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink px-[18px] py-3 font-mono text-[11.5px] text-bg hover:text-bg"
            >
              Repository ↗
            </a>
          )}
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="rounded-full border border-line px-[18px] py-3 font-mono text-[11.5px]">
              Live ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
