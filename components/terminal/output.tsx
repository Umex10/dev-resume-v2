import Image from "next/image";
import type { Line, Tone } from "./commands";
import { Prompt } from "./prompt";
import type { PromptTheme } from "@/content/terminal";

const TONE: Record<Tone, string> = {
  a: "text-acc",
  m: "text-mute",
  r: "text-acc2",
  i: "text-ink",
  g: "text-ok",
};

function Neofetch({ streak }: { streak: number }) {
  const rows: [string, string][] = [
    ["OS", "Linux Mint"],
    ["Host", "Graz, Austria"],
    ["Kernel", "Software Engineering Student"],
    ["Shell", "zsh 5.9"],
    ["IDE", "VSCode"],
    ["Languages", "Java, TypeScript"],
    ["Strengths", "Next.js, Spring Boot"],
    ["Ship", "Docker, GitHub Actions"],
    ["Focus", "auth systems, JWT HS256 / RS256"],
    ["Now", "bachelor thesis — Overex"],
    ["Learning", "Kubernetes, gRPC, microservices"],
    ["Streak", `${streak} days`],
  ];
  const colors = ["#ff5f57", "#febc2e", "#28c840", "var(--acc)", "var(--acc2)", "var(--mute)", "var(--ink)"];
  return (
    <div className="flex flex-wrap gap-5 pt-2 pb-2.5">
      <Image
        src="/umejr-tiny.png"
        alt=""
        width={108}
        height={135}
        unoptimized
        className="h-[135px] w-[108px] flex-none rounded-md [image-rendering:pixelated]"
      />
      <div className="flex min-w-0 flex-col">
        <div>
          <span className="text-acc">umex10</span>@<span className="text-acc">graz</span>
        </div>
        <div className="text-mute">───────────</div>
        {rows.map(([k, v]) => (
          <div key={k}>
            <span className="text-acc">{k}</span>: {v}
          </div>
        ))}
        <div className="mt-2 flex">
          {colors.map((c) => (
            <span key={c} className="h-3 w-[18px]" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OutputLine({ line, prompt, streak }: { line: Line; prompt: PromptTheme; streak: number }) {
  if (line.k === "cmd")
    return (
      <div className="flex flex-wrap items-center">
        <Prompt theme={prompt} />
        <span>{line.t}</span>
      </div>
    );
  if (line.k === "neo") return <Neofetch streak={streak} />;
  return (
    <div className="break-words whitespace-pre-wrap">
      {line.s.map((g, i) => (
        <span key={i} className={TONE[g.c]}>
          {g.t}
        </span>
      ))}
    </div>
  );
}
