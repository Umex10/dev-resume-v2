import type { CSSProperties } from "react";
import { HeroScene } from "./hero-scene";
import { PixelPortrait } from "./pixel-portrait";
import { Typewriter } from "./typewriter";
import { LocalTime } from "@/components/local-time";
import { GITHUB } from "@/content/terminal";

const LINES = [
  { word: "UMEJR", start: 0 },
  { word: "DZINOVIC", start: 0.14 },
];

const delay = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="intro"
      aria-label="Intro"
      className="relative box-border flex min-h-svh flex-col justify-end overflow-hidden px-[clamp(20px,6vw,96px)] pt-[120px] pb-8"
    >
      <HeroScene />
      {/* Height-capped (≈13vh top + 4:5 image + caption) so it always ends above the bio paragraph. */}
      <figure
        className="portrait-in absolute top-[clamp(92px,13vh,150px)] right-[clamp(16px,8vw,170px)] m-0 flex w-[min(clamp(210px,30vw,440px),calc((87svh-320px)*.8))] max-[700px]:w-[min(210px,calc((87svh-400px)*.8))] flex-col gap-2.5"
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-[22px] border border-line bg-[#05070a] shadow-[0_40px_100px_-40px_var(--shadow),inset_0_1px_0_var(--hi)]">
          <PixelPortrait />
        </div>
        <figcaption className="flex justify-between max-[700px]:hidden gap-3 font-mono text-[10px] text-mute">
          <span>fig.01 — portrait.jpg</span>
          <span>hover to resolve</span>
        </figcaption>
      </figure>

      {/* No transform/opacity/z-index here: the name blends against the portrait. */}
      <div className="pointer-events-none relative flex flex-col gap-[clamp(18px,3vh,32px)]">
        <div className="fade-in flex items-center gap-2.5 font-mono text-[11px] text-mute" style={delay(0.6)}>
          <span className="size-[7px] animate-[pulse_2s_infinite] rounded-full bg-acc" />
          <LocalTime prefix="Based in Graz, Austria · " suffix=" local" />
        </div>
        <h1 className="wdth-112 m-0 text-[clamp(50px,13.2vw,250px)] leading-[.8] font-extrabold tracking-[-0.05em] text-white mix-blend-difference">
          {LINES.map(({ word, start }) => (
            <span key={word} className="block overflow-hidden pb-[.04em]" aria-hidden="true">
              {[...word].map((ch, i) => (
                <span key={i} className="rise" style={delay(start + i * 0.04)}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
          <span className="sr-only">Umejr Dzinovic</span>
        </h1>
        <div
          className="fade-in fade-up flex flex-wrap items-end justify-between gap-x-12 gap-y-6"
          style={delay(0.7)}
        >
          <Typewriter />
          <p className="m-0 max-w-[46ch] text-[clamp(15px,1.2vw,17px)] leading-[1.55] text-pretty text-mute">
            Next.js and Spring Boot developer, studying software engineering in Graz. I build Spring Boot APIs with
            stateless JWT auth and the Next.js apps on top — containerised with Docker, shipped through CI/CD.
            Currently writing my bachelor thesis and learning Kubernetes, gRPC and microservices.
          </p>
        </div>
        <div
          className="fade-in pointer-events-auto flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-line pt-[18px] font-mono text-[10.5px] text-mute"
          style={delay(0.9)}
        >
          <span>↓ scroll</span>
          <span>Spring Boot · Next.js · Docker · CI/CD</span>
          <span>Ø 1.20 · writing my bachelor thesis</span>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="text-ink">
            github.com/Umex10 ↗
          </a>
        </div>
      </div>
    </section>
  );
}
