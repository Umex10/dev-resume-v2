"use client";

import { useSite } from "@/components/site-provider";

/** The ~/.zshrc window behind the terminal, mirroring the live settings. */
export function ZshrcGhost() {
  const { prompt, accent, fontSize, flat } = useSite();
  const rows: [string, string][] = [
    ["PROMPT_THEME", `"${prompt}"`],
    ["ACCENT", `"${accent}"`],
    ["FONT_SIZE", String(fontSize)],
    ["TILT_3D", flat ? "off" : "on"],
  ];
  return (
    <div
      aria-hidden="true"
      className="absolute top-[-56px] left-[-7%] w-[54%] overflow-hidden rounded-[14px] border border-line bg-glass font-mono text-[11px] leading-[1.75] text-mute opacity-80 shadow-[inset_0_1px_0_var(--hi)] backdrop-blur-[18px]"
    >
      <div className="flex justify-between border-b border-line px-3.5 py-[9px]">
        <span>~/.zshrc</span>
        <span className="text-acc">● live</span>
      </div>
      <div className="px-3.5 pt-2.5 pb-3.5 whitespace-nowrap">
        {rows.map(([k, v]) => (
          <div key={k}>
            <span className="text-acc2">export</span> {k}=<span className="text-acc">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
