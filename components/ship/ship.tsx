import { FileTabs } from "@/components/deep-dive/file-tabs";
import { Reveal } from "@/components/reveal";
import { PIPELINE_FALLBACK } from "@/content/pipeline";
import { SHIP_FILES } from "@/content/ship-files";
import type { GitHubData } from "@/lib/github";
import { highlightFiles } from "@/lib/highlight";
import { Pipeline } from "./pipeline";

const FACTS = [
  {
    k: "docker",
    v: (
      <>
        Multi-stage images for every service. One <span className="font-mono text-[13px]">docker compose up</span> brings up
        Postgres, the backend and Swagger.
      </>
    ),
  },
  { k: "ci/cd", v: "GitHub Actions: test → build → image → deploy. Railway for the Spring Boot side, Vercel for Next.js." },
  { k: "testing", v: "JUnit 5, MockMvc and Spring Security Test on the backend. Vitest, Testing Library and Playwright e2e on the web." },
];

export async function Ship({ run }: { run: GitHubData["run"] }) {
  const files = await highlightFiles(SHIP_FILES);
  const shown = run
    ? { number: run.number, total: run.total, failed: run.status === "failed" }
    : { number: PIPELINE_FALLBACK.run, total: PIPELINE_FALLBACK.total, failed: false };
  return (
    <section id="ship" aria-labelledby="ship-title" className="section-pad relative box-border flex min-h-svh flex-col gap-[clamp(32px,5vh,56px)]">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-[18px]">
          <span className="font-mono text-[11px] text-acc">05 / ship</span>
          <h2 id="ship-title" className="h2-display">
            Commit to container.
          </h2>
        </div>
        <p className="m-0 max-w-[44ch] text-base leading-[1.6] text-pretty text-mute">
          Every project runs in Docker. Each push runs the test suites — JUnit for Spring Boot, Vitest and Playwright for
          Next.js — and green builds on main get an image and a deploy.
        </p>
      </Reveal>
      <Reveal>
        <Pipeline run={shown} />
      </Reveal>
      <div className="flex flex-wrap items-start gap-[clamp(24px,4vw,56px)]">
        <Reveal className="flex max-w-[440px] flex-[1_1_300px] flex-col">
          {FACTS.map((f, i) => (
            <div key={f.k} className={`flex flex-col gap-2 border-t border-line py-5 ${i === FACTS.length - 1 ? "border-b" : ""}`}>
              <span className="font-mono text-[10.5px] text-acc">{f.k}</span>
              <span className="text-base leading-normal">{f.v}</span>
            </div>
          ))}
        </Reveal>
        <Reveal className="min-w-0 flex-[2_1_520px]">
          <FileTabs
            files={files}
            className="rounded-2xl bg-glass2 shadow-[inset_0_1px_0_var(--hi)] backdrop-blur-[24px]"
            codeClassName="h-[420px]"
          />
        </Reveal>
      </div>
    </section>
  );
}
