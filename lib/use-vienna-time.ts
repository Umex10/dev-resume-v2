"use client";

import { useEffect, useState } from "react";

const fmt = () =>
  new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit" });

/** HH:MM in Graz. Empty on the server, so prerendering stays deterministic. */
export function useViennaTime(): string {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const tick = () => setTime(fmt());
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);
  return time;
}
