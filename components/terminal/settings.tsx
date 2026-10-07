"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSite } from "@/components/site-provider";
import { FONT_SIZES, PROMPTS, type FontSize, type PromptTheme } from "@/content/terminal";
import { ACCENTS, HUES } from "@/lib/accent";
import { cn } from "@/lib/utils";

const ITEM = "h-auto flex-1 rounded-[7px] py-1.5 font-mono text-[10.5px] font-normal text-ink hover:bg-seg2 aria-pressed:bg-seg data-[pressed]:bg-seg";
const GROUP = "w-full gap-1 rounded-[9px] bg-seg2 p-[3px]";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <span>{label}</span>
      {children}
    </div>
  );
}

/** Gear popover: prompt, accent, font size, 3D. Everything persists and shows up in ~/.zshrc. */
export function TerminalSettings() {
  const { prompt, setPrompt, accent, setAccent, fontSize, setFontSize, flat, setFlat } = useSite();
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Terminal settings"
        className="size-7 cursor-pointer rounded-lg border border-line bg-transparent p-0 text-sm leading-none text-ink data-popup-open:bg-seg"
      >
        ⚙
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="glass-strong w-[250px] gap-3.5 rounded-[14px] bg-glass2 p-3.5 font-mono text-[10.5px] text-mute ring-0"
      >
        <Row label="prompt">
          <ToggleGroup
            aria-label="Prompt theme"
            value={[prompt]}
            onValueChange={(v) => v[0] && setPrompt(v[0] as PromptTheme)}
            className={GROUP}
          >
            {PROMPTS.map((p) => (
              <ToggleGroupItem key={p} value={p} className={ITEM}>
                {p === "lambda" ? "λ" : p}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>
        <Row label="accent">
          <div className="flex gap-2" role="radiogroup" aria-label="Accent colour">
            {ACCENTS.map((a) => (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={accent === a}
                aria-label={a}
                onClick={() => setAccent(a)}
                className={cn("size-[26px] cursor-pointer rounded-full border-2 p-0", accent === a ? "border-ink" : "border-transparent")}
                style={{ background: `oklch(.7 .16 ${HUES[a]})` }}
              />
            ))}
          </div>
        </Row>
        <Row label="font size">
          <ToggleGroup
            aria-label="Font size"
            value={[String(fontSize)]}
            onValueChange={(v) => v[0] && setFontSize(Number(v[0]) as FontSize)}
            className={GROUP}
          >
            {FONT_SIZES.map((s) => (
              <ToggleGroupItem key={s.v} value={String(s.v)} className={ITEM}>
                {s.t}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>
        <button
          type="button"
          aria-pressed={!flat}
          onClick={() => setFlat(!flat)}
          className="flex cursor-pointer items-center justify-between rounded-[9px] border border-line bg-transparent px-2.5 py-2 font-[inherit] text-ink"
        >
          <span>3D tilt</span>
          <span className="text-acc">{flat ? "off" : "on"}</span>
        </button>
      </PopoverContent>
    </Popover>
  );
}
