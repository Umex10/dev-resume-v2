import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const VARIANT = { panel: "glass", strong: "glass-strong", chip: "glass-chip" } as const;

/** The one glass recipe. Every translucent surface on the site uses these three utilities. */
export function Glass({ variant = "panel", className, ...props }: HTMLAttributes<HTMLDivElement> & { variant?: keyof typeof VARIANT }) {
  return <div className={cn(VARIANT[variant], className)} {...props} />;
}

export const glass = (variant: keyof typeof VARIANT = "panel") => VARIANT[variant];
