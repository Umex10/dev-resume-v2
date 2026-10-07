import { Reveal } from "@/components/reveal";
import { PROJECTS } from "@/content/projects";
import { CodeFlashlight } from "./code-flashlight";
import { WorkExplorer } from "./work-explorer";

export function Work({ repos }: { repos: number }) {
  return (
    <section id="work" aria-labelledby="work-title" className="section-pad relative box-border min-h-svh overflow-hidden">
      <div className="relative flex flex-col gap-[clamp(36px,6vh,64px)]">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-col gap-[18px]">
            <span className="font-mono text-[11px] text-acc">03 / work</span>
            <h2 id="work-title" className="h2-display">
              Selected work.
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1.5 font-mono text-[11px] text-mute">
            <span>
              {PROJECTS.length} deep dives · {repos} public repositories
            </span>
            <span>hover the preview — real source code sits behind the glass</span>
          </div>
        </Reveal>
        <WorkExplorer flashlight={<CodeFlashlight />} more={Math.max(0, repos - PROJECTS.length)} />
      </div>
    </section>
  );
}
