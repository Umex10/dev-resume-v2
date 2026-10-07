"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useActiveSection } from "@/lib/use-active-section";
import { SECTIONS } from "@/lib/sections";
import { GITHUB } from "@/content/terminal";
import { cn } from "@/lib/utils";

export function Nav() {
  const active = useActiveSection();
  const home = usePathname() === "/";
  const href = (id: string) => (home ? `#${id}` : `/#${id}`);
  const [menu, setMenu] = useState(false);

  return (
    <nav
      aria-label="Main"
      className="fixed top-[14px] left-1/2 z-60 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-line bg-glass p-[5px] font-mono text-[11px] shadow-[inset_0_1px_0_var(--hi),0_20px_50px_-20px_var(--shadow)] backdrop-blur-[24px] backdrop-saturate-[180%]"
    >
      <Link href={href("intro")} className="wdth-125 px-3.5 py-2 font-sans text-[15px] font-extrabold tracking-[-0.04em] whitespace-nowrap">
        umex<span className="text-acc">10</span>
      </Link>
      <div className="hidden gap-0.5 min-[1180px]:flex">
        {SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={href(s.id)}
            aria-current={home && active === i ? "true" : undefined}
            className={cn(
              "rounded-full px-3 py-2 whitespace-nowrap text-ink transition-[background] duration-300 hover:text-acc",
              home && active === i && "bg-seg",
            )}
          >
            {s.label}
          </a>
        ))}
      </div>
      <a href={GITHUB} target="_blank" rel="noreferrer" className="rounded-full px-3 py-2 whitespace-nowrap">
        GitHub ↗
      </a>
      <ThemeToggle />
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetTrigger
          aria-label="Open menu"
          className="ml-0.5 grid size-[34px] cursor-pointer place-items-center rounded-full border border-line bg-transparent text-ink min-[700px]:hidden"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true">
            <path d="M0 1h14M0 5h14M0 9h14" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </SheetTrigger>
        <SheetContent side="right" className="glass-strong w-[min(320px,86vw)] rounded-l-[24px] border-line bg-glass2 p-6 pt-16 text-ink">
          <SheetTitle className="font-mono text-[11px] font-normal text-mute">menu</SheetTitle>
          <ul className="flex flex-col">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={href(s.id)}
                  onClick={() => setMenu(false)}
                  className="flex items-baseline gap-4 border-t border-line py-4"
                >
                  <span className="font-mono text-[11px] text-acc">0{i + 1}</span>
                  <span className="wdth-112 text-[28px] leading-none font-bold tracking-[-0.04em]">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
