"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BufferGeometry } from "three";

const X = 150;
const Z = 70;
const SPACING = 0.13;

type Pointer = { tx: number; tz: number };

function Field({ dark, pointer }: { dark: boolean; pointer: React.RefObject<Pointer> }) {
  const grid = useMemo(() => {
    const p = new Float32Array(X * Z * 3);
    for (let i = 0; i < X; i++)
      for (let j = 0; j < Z; j++) {
        const k = (i * Z + j) * 3;
        p[k] = (i - X / 2) * SPACING;
        p[k + 2] = (j - Z / 2) * SPACING;
      }
    return p;
  }, []);
  const geoRef = useRef<BufferGeometry>(null);
  const ripple = useRef({ mx: 0, mz: 0 });

  useFrame(({ clock }) => {
    const geo = geoRef.current;
    if (!geo) return;
    const s = clock.elapsedTime;
    const r = ripple.current;
    // The ripple point eases toward the pointer.
    r.mx += (pointer.current.tx - r.mx) * 0.05;
    r.mz += (pointer.current.tz - r.mz) * 0.05;
    const a = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < a.length; i += 3) {
      const x = a[i];
      const z = a[i + 2];
      const dx = x - r.mx;
      const dz = z - r.mz;
      const d2 = dx * dx + dz * dz;
      a[i + 1] =
        Math.sin(x * 0.55 + s * 0.7) * 0.22 +
        Math.sin(z * 0.9 + s * 0.5) * 0.14 +
        Math.exp(-d2 * 0.3) * 0.6 * Math.cos(Math.sqrt(d2) * 2.4 - s * 3);
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[grid, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.026} transparent opacity={0.7} depthWrite={false} color={dark ? "#b0a6d6" : "#3f3858"} />
    </points>
  );
}

/** Hero background: a 150×70 point grid with a cursor ripple. */
export default function WaveField({ running, dark }: { running: boolean; dark: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ tx: 0, tz: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = host.current?.closest("section");
    if (!section || !host.current) return;
    const el = host.current;
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      pointer.current.tx = ((e.clientX - b.left) / b.width - 0.5) * 12;
      pointer.current.tz = ((e.clientY - b.top) / b.height - 0.5) * 6;
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={host} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas
        flat
        dpr={[1, 2]}
        frameloop={running ? "always" : "demand"}
        gl={{ alpha: true, antialias: true }}
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 2.2, 7.5] }}
        onCreated={({ camera }) => {
          camera.lookAt(0, -0.6, 0);
          requestAnimationFrame(() => setReady(true));
        }}
        style={{ touchAction: "pan-y" }}
      >
        <Field dark={dark} pointer={pointer} />
      </Canvas>
    </div>
  );
}
