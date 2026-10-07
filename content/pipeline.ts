import type { PipelineStage } from "./types";

export const PIPELINE: PipelineStage[] = [
  { n: "push", sub: "git push origin main", t: "1s" },
  { n: "test", sub: "JUnit 5 · Vitest · Playwright", t: "58s" },
  { n: "build", sub: "mvn verify · next build", t: "1m 12s" },
  { n: "docker", sub: "multi-stage image", t: "36s" },
  { n: "publish", sub: "push → ghcr.io", t: "9s" },
  { n: "deploy", sub: "Railway · Vercel", t: "21s" },
];

/** Shown when the GitHub Actions API has no run for authkit (yet). */
export const PIPELINE_FALLBACK = { run: 142, total: "3m 17s", repo: "authkit", branch: "main" };
