import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { accentRgb, rgbCss } from "@/lib/accent";

export const alt = "Umejr Dzinovic — Next.js & Spring Boot developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CELL = 11;
const ACC = rgbCss(accentRgb("violet", "dark"));

/** Name + the pixel portrait, built from the same 36×45 PNG the terminal's neofetch uses. */
export default async function OpengraphImage() {
  const root = process.cwd();
  const [archivo, martian, raw] = await Promise.all([
    readFile(path.join(root, "assets/fonts/archivo-112-800.ttf")),
    readFile(path.join(root, "assets/fonts/martian-mono-400.ttf")),
    sharp(path.join(root, "public/umejr-tiny.png")).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);
  const { data, info } = raw;
  const cells: string[] = [];
  for (let i = 0; i < info.width * info.height; i++) {
    const [r, g, b] = [0, 1, 2].map((c) => Math.min(255, Math.round(data[i * 3 + c] * 1.3)));
    cells.push(`rgb(${r},${g},${b})`);
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#08090c", color: "#edf0f5", padding: 64, position: "relative" }}>
        <div style={{ position: "absolute", left: -180, top: -220, width: 700, height: 700, borderRadius: 999, background: ACC, opacity: 0.22, filter: "blur(120px)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontFamily: "Martian", fontSize: 18, color: "#8a92a2" }}>umex10 · graz, at</div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Archivo", fontSize: 132, lineHeight: 0.84, letterSpacing: -6 }}>
            <span>UMEJR</span>
            <span>DZINOVIC</span>
          </div>
          <div style={{ display: "flex", fontFamily: "Martian", fontSize: 20, color: "#8a92a2" }}>
            <span style={{ color: ACC }}>Next.js</span>
            <span style={{ margin: "0 12px" }}>·</span>
            <span style={{ color: ACC }}>Spring Boot</span>
            <span style={{ margin: "0 12px" }}>·</span>
            <span>Docker · CI/CD</span>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: info.width * CELL, height: info.height * CELL, alignSelf: "center", borderRadius: 18, overflow: "hidden", background: "#05070a" }}>
          {cells.map((c, i) => (
            <div key={i} style={{ width: CELL - 2, height: CELL - 2, margin: 1, background: c }} />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: archivo, weight: 800, style: "normal" },
        { name: "Martian", data: martian, weight: 400, style: "normal" },
      ],
    },
  );
}
