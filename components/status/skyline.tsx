"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BoxGeometry, Color, Group, InstancedMesh, Matrix4, MeshStandardMaterial, SRGBColorSpace } from "three";
import { WEEKS } from "@/lib/contributions";

const D = 7;
type Drag = { ry: number; rx: number };

function Bars({ levels, accent, dark, drag }: { levels: number[]; accent: [number, number, number]; dark: boolean; drag: React.RefObject<Drag> }) {
  const group = useRef<Group>(null);
  const mesh = useRef<InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const geo = useMemo(() => new BoxGeometry(0.4, 1, 0.4).translate(0, 0.5, 0), []);
  const mat = useMemo(() => new MeshStandardMaterial({ roughness: 0.35, metalness: 0.1 }), []);
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat]);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const M = new Matrix4();
    levels.forEach((v, i) => {
      const w = Math.floor(i / D);
      const d = i % D;
      M.makeScale(1, 0.06 + v * 0.24, 1);
      M.setPosition((w - WEEKS / 2 + 0.5) * 0.5, 0, (d - D / 2 + 0.5) * 0.5);
      m.setMatrixAt(i, M);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [levels]);

  // Colour lerps from base to accent by level; re-run on accent / theme change.
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const base = new Color(dark ? "#201c2e" : "#d6d2e0");
    const acc = new Color().setRGB(accent[0], accent[1], accent[2], SRGBColorSpace);
    const c = new Color();
    levels.forEach((v, i) => m.setColorAt(i, c.copy(base).lerp(acc, v ? 0.3 + (0.7 * v) / 10 : 0)));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    invalidate();
  }, [levels, accent, dark, invalidate]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = -0.35 + Math.sin(clock.elapsedTime * 0.25) * 0.35 + drag.current.ry;
    g.rotation.x = drag.current.rx;
  });

  return (
    <group ref={group}>
      <instancedMesh key={levels.length} ref={mesh} args={[geo, mat, levels.length]} />
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[WEEKS * 0.5 + 0.8, 0.3, D * 0.5 + 0.8]} />
        <meshStandardMaterial roughness={0.5} metalness={0.2} color={dark ? "#121019" : "#e6e4ec"} />
      </mesh>
    </group>
  );
}

/** Contribution skyline: slow pendulum, drag to orbit (Y unlimited, X clamped −.3….7). */
export default function Skyline(props: { levels: number[]; accent: [number, number, number]; dark: boolean; running: boolean }) {
  const drag = useRef<Drag>({ ry: 0, rx: 0.1 });
  const last = useRef<{ x: number; y: number } | null>(null);
  const inv = useRef<() => void>(() => undefined);
  const [ready, setReady] = useState(false);

  return (
    <div
      className="absolute inset-0 cursor-grab touch-pan-y transition-opacity duration-1000 active:cursor-grabbing"
      style={{ opacity: ready ? 1 : 0 }}
      onPointerDown={(e) => {
        last.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const l = last.current;
        if (!l) return;
        const d = drag.current;
        d.ry += (e.clientX - l.x) * 0.008;
        d.rx = Math.max(-0.3, Math.min(0.7, d.rx + (e.clientY - l.y) * 0.004));
        last.current = { x: e.clientX, y: e.clientY };
        inv.current();
      }}
      onPointerUp={() => (last.current = null)}
      onPointerCancel={() => (last.current = null)}
    >
      <Canvas
        flat
        dpr={[1, 2]}
        frameloop={props.running ? "always" : "demand"}
        gl={{ alpha: true, antialias: true }}
        camera={{ fov: 30, near: 0.1, far: 200, position: [0, 12, 27] }}
        onCreated={({ camera, invalidate }) => {
          camera.lookAt(0, 0.5, 0);
          inv.current = invalidate;
          requestAnimationFrame(() => setReady(true));
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight intensity={1.8} position={[6, 14, 8]} />
        <Bars levels={props.levels} accent={props.accent} dark={props.dark} drag={drag} />
      </Canvas>
    </div>
  );
}
