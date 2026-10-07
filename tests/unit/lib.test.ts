import { describe, expect, it } from "vitest";
import { splitRole } from "@/components/hero/typewriter";
import { accentRgb, oklchToSrgb } from "@/lib/accent";
import { DAYS, computeStreak, lastDots, seededLevels, toLevels } from "@/lib/contributions";

describe("accent", () => {
  it("converts OKLCH to sRGB", () => {
    expect(oklchToSrgb(1, 0, 0).map((v) => +v.toFixed(3))).toEqual([1, 1, 1]);
    expect(oklchToSrgb(0, 0, 0)).toEqual([0, 0, 0]);
  });
  it("uses a darker lightness in the light theme", () => {
    const sum = (c: number[]) => c.reduce((a, b) => a + b, 0);
    expect(sum(accentRgb("violet", "light"))).toBeLessThan(sum(accentRgb("violet", "dark")));
  });
});

describe("contributions", () => {
  const days = (counts: number[]) => counts.map((count, i) => ({ date: String(i), count }));

  it("counts the current streak, tolerating an empty today", () => {
    expect(computeStreak(days([1, 0, 2, 3, 4]))).toBe(3);
    expect(computeStreak(days([0, 2, 3, 0]))).toBe(2);
    expect(computeStreak(days([0, 0]))).toBe(0);
  });

  it("maps counts onto 0…10 against the 95th percentile", () => {
    const l = toLevels([0, 1, 5, 10, 200]);
    expect(l[0]).toBe(0);
    expect(Math.max(...l)).toBe(10);
    expect(l.every((v) => v >= 0 && v <= 10)).toBe(true);
    expect(l[1]).toBeGreaterThanOrEqual(1);
  });

  it("reproduces the design's seeded fallback", () => {
    const s = seededLevels();
    expect(s).toHaveLength(DAYS);
    expect(s.slice(-250).every((v) => v > 0)).toBe(true);
    expect(seededLevels()).toEqual(s);
  });

  it("returns 14 dot opacities", () => {
    expect(lastDots(seededLevels())).toHaveLength(14);
  });
});

describe("typewriter", () => {
  it("splits off the -er suffix", () => {
    expect(splitRole("Backender", "Backender")).toEqual(["Backend", "er"]);
    expect(splitRole("CI/CDe", "CI/CDer")).toEqual(["CI/CD", "e"]);
    expect(splitRole("Fro", "Frontender")).toEqual(["Fro", ""]);
  });
});
