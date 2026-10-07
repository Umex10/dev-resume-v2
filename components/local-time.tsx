"use client";

import { useViennaTime } from "@/lib/use-vienna-time";

export function LocalTime({ prefix = "", suffix = "" }: { prefix?: string; suffix?: string }) {
  const time = useViennaTime();
  return (
    <span suppressHydrationWarning>
      {prefix}
      {time}
      {suffix}
    </span>
  );
}
