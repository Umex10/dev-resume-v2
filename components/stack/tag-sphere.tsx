"use client";

import { useEffect, useRef } from "react";
import { useSite } from "@/components/site-provider";
import { useInView } from "@/lib/use-in-view";

const AUTO_X = 0.0012;
const AUTO_Y = 0.004;

/** Tags on a Fibonacci sphere, as DOM elements transformed every frame. Drag sets the spin. */
export function TagSphere({ tags }: { tags: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const { reduced } = useSite();
  const s = useRef({ ax: 0, ay: 0, vx: AUTO_X, vy: AUTO_Y, drag: false, lx: 0, ly: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !visible) return;
    const nodes = [...el.querySelectorAll<HTMLElement>("[data-tag]")];
    const n = nodes.length;
    const pts = nodes.map((_, i) => {
      const y = 1 - ((i + 0.5) / n) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * 2.399963;
      return [Math.cos(a) * r, y, Math.sin(a) * r] as const;
    });
    let raf = 0;
    const tick = () => {
      const k = s.current;
      k.ay += k.vy;
      k.ax += k.vx;
      if (!k.drag) {
        k.vy += (AUTO_Y - k.vy) * 0.02;
        k.vx += (AUTO_X - k.vx) * 0.02;
      }
      const R = Math.min(el.clientWidth, el.clientHeight) * 0.42;
      const [ca, sa, cb, sb] = [Math.cos(k.ax), Math.sin(k.ax), Math.cos(k.ay), Math.sin(k.ay)];
      nodes.forEach((t, i) => {
        const [x, y, z] = pts[i];
        const x1 = x * cb + z * sb;
        const z1 = -x * sb + z * cb;
        const y2 = y * ca - z1 * sa;
        const z2 = y * sa + z1 * ca;
        const f = (z2 + 1) / 2; // depth 0 (back) … 1 (front)
        t.style.transform = `translate(-50%,-50%) translate(${x1 * R}px,${y2 * R}px) scale(${0.6 + 0.45 * f})`;
        t.style.opacity = String(0.15 + 0.85 * f);
        t.style.zIndex = String(Math.round(f * 100));
      });
      if (!reduced || k.drag) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const wake = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointerdown", wake);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", wake);
    };
  }, [visible, reduced]);

  return (
    <div
      ref={ref}
      className="relative h-[clamp(380px,64vh,620px)] flex-[1_1_380px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      onPointerDown={(e) => {
        Object.assign(s.current, { drag: true, lx: e.clientX, ly: e.clientY });
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const k = s.current;
        if (!k.drag) return;
        k.vy = (e.clientX - k.lx) * 0.0012;
        k.vx = -(e.clientY - k.ly) * 0.0012;
        k.lx = e.clientX;
        k.ly = e.clientY;
      }}
      onPointerUp={() => (s.current.drag = false)}
      onPointerCancel={() => (s.current.drag = false)}
    >
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 aspect-square w-[62%] -translate-1/2 rounded-full border border-dashed border-line" />
      <ul className="m-0 list-none p-0" aria-label="Tools">
        {tags.map((t) => (
          <li
            key={t}
            data-tag=""
            className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-line bg-glass2 px-3 py-[7px] font-mono text-[13px] whitespace-nowrap text-ink will-change-transform"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
