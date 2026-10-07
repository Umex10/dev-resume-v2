"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True on "/", but only once hydrated. The layout shell can be prerendered without the real pathname
 * (it is on Vercel), so the server snapshot is always false — otherwise the nav would mismatch and React
 * would re-render the whole document, wiping the boot script's <html> attributes.
 */
export function useIsHome(): boolean {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return hydrated && pathname === "/";
}
