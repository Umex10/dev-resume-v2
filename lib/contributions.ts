export type Day = { date: string; count: number };

export const WEEKS = 52;
export const DAYS = WEEKS * 7;

/** Mulberry32 — the design's seeded RNG, so the fallback skyline looks identical. */
export function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The design's seeded levels (0…10): a 250-day streak at the end. */
export function seededLevels(): number[] {
  const rand = rng(10);
  const out: number[] = [];
  for (let i = 0; i < DAYS; i++) {
    const ago = DAYS - 1 - i;
    out.push(ago < 250 ? 1 + Math.floor(rand() ** 1.7 * 10) : rand() < 0.45 ? 0 : Math.floor(rand() * 4));
  }
  return out;
}

/** Map raw daily counts onto 0…10 against the 95th percentile, so one huge day doesn't flatten the rest. */
export function toLevels(counts: number[]): number[] {
  const nonZero = counts.filter((c) => c > 0).sort((a, b) => a - b);
  if (!nonZero.length) return counts.map(() => 0);
  const p95 = nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * 0.95))];
  return counts.map((c) => (c <= 0 ? 0 : Math.max(1, Math.min(10, Math.round((c / p95) * 10)))));
}

/**
 * Current streak in days. Today may still be empty (the day isn't over),
 * so counting starts from yesterday in that case.
 */
export function computeStreak(days: Day[]): number {
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let n = 0;
  for (; i >= 0 && days[i].count > 0; i--) n++;
  return n;
}

/** Longest run of consecutive days with contributions. */
export function longestStreak(days: Day[]): number {
  let best = 0;
  let n = 0;
  for (const d of days) {
    n = d.count > 0 ? n + 1 : 0;
    best = Math.max(best, n);
  }
  return best;
}

/** Opacity per dot for the last 14 days, like the design's streak tile. */
export function lastDots(levels: number[], n = 14): number[] {
  return levels.slice(-n).map((v) => (v === 0 ? 0.12 : 0.35 + 0.65 * (v / 10)));
}
