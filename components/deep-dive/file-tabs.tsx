"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HighlightedFile } from "@/lib/highlight";
import { cn } from "@/lib/utils";

/** Tabs per curated file: path in the header, Shiki-highlighted code, one sentence on why it matters. */
export function FileTabs({ files, codeClassName, className }: { files: HighlightedFile[]; codeClassName?: string; className?: string }) {
  const [tab, setTab] = useState(files[0]?.name ?? "");
  const current = files.find((f) => f.name === tab) ?? files[0];
  if (!current) return null;
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className={cn("gap-0 overflow-hidden rounded-[14px] border border-line", className)}>
      <div className="flex items-center gap-0.5 overflow-x-auto border-b border-line p-1.5">
        <TabsList className="h-auto gap-0.5 rounded-none bg-transparent p-0">
          {files.map((f) => (
            <TabsTrigger
              key={f.name}
              value={f.name}
              className="h-auto flex-none cursor-pointer rounded-lg border-0 px-3 py-2 font-mono text-[11px] font-normal whitespace-nowrap text-mute hover:text-ink data-active:bg-seg data-active:text-ink data-active:shadow-none dark:data-active:border-0 dark:data-active:bg-seg"
            >
              {f.name}
              {f.planned && <span className="ml-1.5 rounded-full border border-line px-1.5 text-[9px] text-acc2">planned</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        <span className="ml-auto px-2.5 font-mono text-[10px] whitespace-nowrap text-mute">{current.path}</span>
      </div>
      {files.map((f) => (
        <TabsContent key={f.name} value={f.name} className="text-ink">
          <div
            data-lenis-prevent
            className={cn("code-block overflow-auto p-[18px]", codeClassName)}
            dangerouslySetInnerHTML={{ __html: f.html }}
          />
          <div className="border-t border-line px-[18px] py-3 text-sm leading-normal text-mute">{f.note}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
