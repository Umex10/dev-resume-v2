"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { SceneMount } from "@/components/three/scene-mount";
import { useSite } from "@/components/site-provider";
import { accentRgb } from "@/lib/accent";

const Skyline = dynamic(() => import("./skyline"), { ssr: false });

export function SkylineTile({ levels, total }: { levels: number[]; total: number | null }) {
  const { resolvedTheme } = useTheme();
  const { accent, reduced } = useSite();
  const dark = resolvedTheme !== "light";
  const rgb = useMemo(() => accentRgb(accent, dark ? "dark" : "light"), [accent, dark]);
  return (
    <div className="glass flex min-h-[420px] flex-col overflow-hidden rounded-[22px] shadow-[inset_0_1px_0_var(--hi)] min-[960px]:col-span-4 min-[960px]:row-span-2">
      <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 px-[22px] pt-5 font-mono text-[10.5px] text-mute">
        <span>contributions · last 52 weeks{total != null && ` · ${total}`}</span>
        <span className="whitespace-nowrap">drag to orbit</span>
      </div>
      <SceneMount className="min-h-[300px] flex-1">
        {(visible) => <Skyline levels={levels} accent={rgb} dark={dark} running={visible && !reduced} />}
      </SceneMount>
      <div className="flex items-center justify-between gap-3 px-[22px] pb-5 font-mono text-[10px] text-mute">
        <span>contribution skyline</span>
        <span className="flex items-center gap-1" aria-label="Legend: less to more">
          less
          <span className="size-2.5 rounded-xs bg-seg" />
          <span className="size-2.5 rounded-xs bg-acc opacity-40" />
          <span className="size-2.5 rounded-xs bg-acc opacity-70" />
          <span className="size-2.5 rounded-xs bg-acc" />
          more
        </span>
      </div>
    </div>
  );
}
