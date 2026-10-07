import Image from "next/image";
import type { Project } from "@/content/types";

/** Screenshot for a project; Overex has none yet, so it gets its architecture as a placeholder. */
export function Shot({ project, sizes, priority = false }: { project: Project; sizes: string; priority?: boolean }) {
  if (!project.shots)
    return (
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(var(--line)_1px,transparent_1px)] bg-size-[18px_18px] p-6">
        <div className="flex flex-col items-center gap-3 text-center font-mono text-[10.5px] text-mute">
          <span className="text-acc">● in progress</span>
          <span className="wdth-112 font-sans text-[clamp(28px,4vw,48px)] leading-none font-bold tracking-[-0.04em] text-ink">
            {project.name}
          </span>
          <span>{project.arch.join("  →  ")}</span>
        </div>
      </div>
    );
  return (
    <Image
        src={`/work/${project.id}/desktop.webp`}
        alt={`Screenshot of ${project.name}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
  );
}
