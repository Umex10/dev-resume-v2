import { FLASHLIGHT } from "@/content/ship-files";
import { readCode } from "@/lib/highlight";

const ANNOTATION = /^(\s*)(@[A-Za-z]+.*)$/;

/** Annotations in accent2, everything else in mute — the flashlight mask does the rest. */
function Code({ code }: { code: string }) {
  return code.split("\n").map((line, i) => {
    const m = ANNOTATION.exec(line);
    return (
      <span key={i}>
        {m ? (
          <>
            {m[1]}
            <span className="text-acc2">{m[2]}</span>
          </>
        ) : (
          line
        )}
        {"\n"}
      </span>
    );
  });
}

/** Four columns of real source code, revealed by a radial mask that follows the pointer. */
export async function CodeFlashlight() {
  const columns = await Promise.all(
    FLASHLIGHT.map((col) => Promise.all(col.map(async (f) => ({ ...f, code: await readCode(f.source) })))),
  );
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-9 p-5 font-mono text-[11px] leading-[1.75] whitespace-pre text-mute">
      {columns.map((col, i) => (
        <div key={i}>
          {col.map((f, j) => (
            <div key={f.source}>
              {j > 0 && "\n"}
              <span className="text-acc">{"// " + f.title}</span>
              {"\n"}
              <Code code={f.code.replace(/\n+$/, "")} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
