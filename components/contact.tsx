"use client";

import { useLenis } from "lenis/react";
import { useState } from "react";
import { toast } from "sonner";
import { LocalTime } from "@/components/local-time";
import { Reveal } from "@/components/reveal";
import { useSite } from "@/components/site-provider";
import { EMAIL, GITHUB } from "@/content/terminal";

const PILL = "flex items-center rounded-full border border-line px-[18px] py-[13px] font-mono text-xs cursor-pointer";

export function Contact() {
  const { replayIntro } = useSite();
  const lenis = useLenis();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      toast("copied", { description: EMAIL });
    } catch {
      toast("copy failed — " + EMAIL);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const replay = () => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0 });
    replayIntro();
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative box-border flex min-h-svh flex-col justify-between gap-12 px-[clamp(20px,6vw,96px)] pt-[clamp(100px,14vh,140px)] pb-7"
    >
      <span className="font-mono text-[11px] text-acc">07 / contact</span>
      <Reveal className="flex flex-col gap-[clamp(24px,4vh,40px)]">
        <p id="contact-title" className="m-0 max-w-[30ch] text-[clamp(20px,2vw,28px)] leading-[1.3] text-pretty text-mute">
          Got a role, a project, or a bug that needs squashing?
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="wdth-125 w-fit text-[clamp(64px,15vw,280px)] leading-[.8] font-extrabold tracking-[-0.06em] text-ink transition-colors duration-300 hover:text-acc"
        >
          Let&apos;s talk<span className="text-acc">.</span>
        </a>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" onClick={copy} className={`${PILL} glass-chip gap-3.5 text-ink`}>
            {EMAIL} <span className="text-acc">{copied ? "copied ✓" : "copy"}</span>
          </button>
          <a href={GITHUB} target="_blank" rel="noreferrer" className={`${PILL} glass-chip`}>
            GitHub ↗
          </a>
          <button type="button" onClick={replay} className={`${PILL} bg-transparent text-mute`}>
            ↻ replay intro
          </button>
        </div>
      </Reveal>
      <footer className="flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-line pt-[18px] font-mono text-[10.5px] text-mute">
        <span>© 2026 Umejr Džinović</span>
        <span>Built by hand. No shortcuts.</span>
        <LocalTime prefix="Graz " />
        <a href="#intro" className="text-ink">
          ↑ top
        </a>
      </footer>
    </section>
  );
}
