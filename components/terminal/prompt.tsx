import type { PromptTheme } from "@/content/terminal";

const CHEVRON = "polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%)";
const CHEVRON_IN = "polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%,8px 50%)";

/** arrow: three powerline segments · pure: path + branch + ❯ · lambda: λ */
export function Prompt({ theme }: { theme: PromptTheme }) {
  if (theme === "pure")
    return (
      <span className="mr-2.5 shrink-0">
        <span className="text-acc">~/dev-resume</span> <span className="text-mute">main*</span>{" "}
        <span className="text-acc2">❯</span>
      </span>
    );
  if (theme === "lambda") return <span className="mr-2.5 shrink-0 text-acc">λ</span>;
  return (
    <span className="mr-2.5 inline-flex shrink-0 leading-[1.6]">
      <span className="bg-acc pr-3.5 pl-[9px] font-semibold text-[#05070a]" style={{ clipPath: CHEVRON }}>
        umejr
      </span>
      <span className="-ml-[5px] bg-seg px-3.5" style={{ clipPath: CHEVRON_IN }}>
        ~/dev-resume
      </span>
      <span className="-ml-[5px] bg-seg2 px-3.5 text-acc" style={{ clipPath: CHEVRON_IN }}>
        ⎇ main
      </span>
    </span>
  );
}
