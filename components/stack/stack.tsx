import { Reveal } from "@/components/reveal";
import { SPHERE_TAGS, TOOL_GROUPS } from "@/content/stack";
import { TagSphere } from "./tag-sphere";

export function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="section-pad relative box-border flex min-h-svh flex-wrap items-center gap-[clamp(32px,5vw,80px)]"
    >
      <TagSphere tags={SPHERE_TAGS} />
      <Reveal className="flex min-w-0 flex-[1_1_420px] flex-col gap-7">
        <div className="flex flex-col gap-[18px]">
          <span className="font-mono text-[11px] text-acc">06 / stack</span>
          <h2 id="stack-title" className="h2-display">
            The toolbox.
          </h2>
        </div>
        <dl className="m-0 flex flex-col">
          {TOOL_GROUPS.map((g) => (
            <div key={g.label} className="grid grid-cols-[minmax(90px,130px)_minmax(0,1fr)] items-baseline gap-4 border-t border-line py-4">
              <dt className="font-mono text-[10.5px] tracking-[.05em] text-mute uppercase">{g.label}</dt>
              <dd className="m-0 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[17px] font-medium">
                {g.items.map((i) => (
                  <span key={i}>{i}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
