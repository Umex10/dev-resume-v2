"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { useSite } from "@/components/site-provider";
import { accentRgb, rgbCss } from "@/lib/accent";
import { useInView } from "@/lib/use-in-view";

type Grid = { px: number; cols: number; rows: number; d: Uint8ClampedArray };

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number) {
  const s = Math.max(W / img.width, H / img.height);
  const w = img.width * s;
  const h = img.height * s;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

/** Downsampled colour grid for one pixel size — cached per size. */
function sample(img: HTMLImageElement, cw: number, ch: number, px: number, cache: Map<number, Grid>): Grid {
  const hit = cache.get(px);
  if (hit) return hit;
  const cols = Math.ceil(cw / px);
  const rows = Math.ceil(ch / px);
  const t = document.createElement("canvas");
  t.width = cols;
  t.height = rows;
  // CPU-backed: reading back a GPU canvas can return half-decoded image data, which shows as green squares.
  const tx = t.getContext("2d", { willReadFrequently: true })!;
  tx.imageSmoothingQuality = "high";
  cover(tx, img, cols, rows);
  const g = { px, cols, rows, d: tx.getImageData(0, 0, cols, rows).data };
  cache.set(px, g);
  return g;
}

/**
 * The portrait as LED squares (14% gap, ×1.3 brightness). A circular lens shows the
 * full-resolution photo: it follows the pointer, and drifts over the face when idle.
 */
export function PixelPortrait({ pixelSize = 12, src = "/umejr.jpg" }: { pixelSize?: number; src?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const visible = useInView(ref);
  const { revealed, reduced, accent } = useSite();
  const { resolvedTheme } = useTheme();
  const state = useRef({ px: 64, lens: { x: 0, y: 0, r: 0, hx: 0, hy: 0, hover: false }, cache: new Map<number, Grid>(), hiddenFrame: false });
  const img = useRef<HTMLImageElement | null>(null);
  const live = useRef({ revealed, reduced, ring: "" });
  useEffect(() => {
    live.current = { revealed, reduced, ring: rgbCss(accentRgb(accent, resolvedTheme === "light" ? "light" : "dark")) };
  }, [revealed, reduced, accent, resolvedTheme]);

  useEffect(() => {
    const i = new Image();
    i.src = src;
    i.decode().then(() => (img.current = i)).catch(() => undefined);
  }, [src]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const L = state.current.lens;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch keeps the idle drift
      const b = c.getBoundingClientRect();
      L.hx = e.clientX - b.left;
      L.hy = e.clientY - b.top;
      L.hover = true;
    };
    const leave = () => (L.hover = false);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerleave", leave);
    return () => {
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const font = ref.current ? getComputedStyle(ref.current).fontFamily : "monospace";
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const c = ref.current;
      const im = img.current;
      if (!c || !im) return;
      const S = state.current;
      const { revealed: on, reduced: still, ring } = live.current;
      if (!on && S.hiddenFrame) return; // behind the opener: one frame is enough
      S.hiddenFrame = !on;
      const s = still ? 0 : t / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (!w) return;
      if (c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        S.cache.clear();
      }
      const target = on ? pixelSize : 64;
      S.px = still ? target : S.px + (target - S.px) * 0.045;
      const px = Math.max(3, Math.round(S.px)) * dpr;
      const { cols, rows, d } = sample(im, c.width, c.height, px, S.cache);
      const ctx = c.getContext("2d")!;
      const gap = Math.max(1, px * 0.14);
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, c.width, c.height);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          ctx.fillStyle = `rgb(${Math.min(255, d[i] * 1.3)},${Math.min(255, d[i + 1] * 1.3)},${Math.min(255, d[i + 2] * 1.3)})`;
          ctx.fillRect(x * px, y * px, px - gap, px - gap);
        }
      const L = S.lens;
      const tx = L.hover ? L.hx : w * (0.42 + 0.07 * Math.sin(s * 0.6));
      const ty = L.hover ? L.hy : h * (0.4 + 0.06 * Math.cos(s * 0.8));
      const tr = !on ? 0 : L.hover ? w * 0.26 : w * 0.16;
      L.x += (tx - L.x) * 0.12;
      L.y += (ty - L.y) * 0.12;
      L.r += (tr - L.r) * 0.08;
      if (L.r > 2) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(L.x * dpr, L.y * dpr, L.r * dpr, 0, Math.PI * 2);
        ctx.clip();
        cover(ctx, im, c.width, c.height);
        ctx.restore();
        ctx.strokeStyle = ring;
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.arc(L.x * dpr, L.y * dpr, L.r * dpr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = ring;
        ctx.font = `${10 * dpr}px ${font}`;
        ctx.fillText("1:1", (L.x + L.r * 0.72) * dpr, (L.y - L.r * 0.72) * dpr);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [visible, pixelSize]);

  return (
    <canvas
      ref={ref}
      aria-label="Portrait of Umejr Džinović, rendered as LED pixels"
      role="img"
      className="absolute inset-0 block size-full cursor-crosshair font-mono"
      style={{ touchAction: "pan-y" }}
    />
  );
}
