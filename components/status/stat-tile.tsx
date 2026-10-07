import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A 2-column bento tile with a mono label on top. */
export function StatTile({ label, children, className, href }: { label: ReactNode; children: ReactNode; className?: string; href?: string }) {
  const cls = cn(
    "glass flex flex-col justify-between gap-5 rounded-[22px] p-[22px] text-ink shadow-[inset_0_1px_0_var(--hi)] min-[960px]:col-span-2",
    className,
  );
  const body = (
    <>
      <span className="flex justify-between font-mono text-[10.5px] text-mute">{label}</span>
      {children}
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cn(cls, "hover:text-ink")}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
