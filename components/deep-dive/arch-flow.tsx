import { Fragment } from "react";

/** Architecture chips joined by accent arrows. */
export function ArchFlow({ steps }: { steps: string[] }) {
  return (
    <ol className="m-0 flex list-none flex-wrap items-center gap-2.5 p-0">
      {steps.map((s, i) => (
        <Fragment key={s}>
          <li className="glass rounded-[14px] px-[18px] py-3.5 font-mono text-xs shadow-[inset_0_1px_0_var(--hi)]">{s}</li>
          {i < steps.length - 1 && (
            <li aria-hidden="true" className="font-mono text-acc">
              →
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
