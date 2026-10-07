import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-svh place-items-center px-5">
      <div className="flex flex-col items-start gap-6 font-mono text-[11px] text-mute">
        <span className="text-acc2">zsh: no such file or directory</span>
        <span className="wdth-62 font-sans text-[clamp(96px,24vw,360px)] leading-[.76] font-extralight text-ink">404</span>
        <Link href="/" className="rounded-full bg-ink px-4 py-[11px] text-bg hover:text-bg">
          cd ~ →
        </Link>
      </div>
    </main>
  );
}
