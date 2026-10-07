"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { SceneMount } from "@/components/three/scene-mount";
import { useSite } from "@/components/site-provider";

const WaveField = dynamic(() => import("./wave-field"), { ssr: false });

export function HeroScene() {
  const { resolvedTheme } = useTheme();
  const { reduced, revealed } = useSite();
  return (
    <SceneMount className="absolute inset-0 opacity-85">
      {(visible) => <WaveField running={visible && revealed && !reduced} dark={resolvedTheme !== "light"} />}
    </SceneMount>
  );
}
