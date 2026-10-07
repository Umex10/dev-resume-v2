export const HUES = { violet: 292, blue: 245, orange: 52, green: 152, red: 22 } as const;

export type Accent = keyof typeof HUES;
export type Theme = "dark" | "light";

export const ACCENTS = Object.keys(HUES) as Accent[];
export const ACCENT_KEY = "umex-accent";

export const isAccent = (v: unknown): v is Accent => typeof v === "string" && v in HUES;

/** OKLCH → gamma-encoded sRGB in 0…1, clamped. Same maths as the design's logic. */
export function oklchToSrgb(L: number, C: number, H: number): [number, number, number] {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const f = (x: number) => {
    const c = Math.max(0, Math.min(1, x));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  };
  return [
    f(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    f(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    f(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** The accent as sRGB for WebGL / canvas — mirrors --acc, including --accL per theme. */
export function accentRgb(accent: Accent, theme: Theme): [number, number, number] {
  return oklchToSrgb(theme === "light" ? 0.52 : 0.72, 0.16, HUES[accent]);
}

export const rgbCss = ([r, g, b]: [number, number, number]) =>
  `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
