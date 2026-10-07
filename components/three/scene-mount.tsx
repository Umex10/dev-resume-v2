"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/**
 * Mounts a WebGL scene only once it is near the viewport, and tells it whether it is
 * on screen so it can pause its frame loop.
 */
export function SceneMount({
  className,
  children,
}: {
  className?: string;
  children: (visible: boolean) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { rootMargin: "300px", once: true });
  const visible = useInView(ref);
  return (
    <div ref={ref} className={cn("relative", className)}>
      {near && children(visible)}
    </div>
  );
}
