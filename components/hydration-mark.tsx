"use client";

import { useEffect } from "react";

/**
 * Marks <html data-hydrated> once the page content itself has hydrated — e2e tests wait for it.
 * Lives inside the page, not the layout: the layout hydrates before the streamed page is swapped in.
 */
export function HydrationMark() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "";
  }, []);
  return null;
}
