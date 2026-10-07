import Link from "next/link";
import { cn } from "@/lib/utils";

const STRATEGIES = [
  { tag: "01 · project work + thesis", name: "Ticket lock system", main: true },
  { tag: "02 · thesis", name: "Redis reservation" },
  { tag: "03 · thesis", name: "Queue · Kafka" },
];

/** Overex — currently building, bachelor thesis. */
export function NowCard() {
  return (
    <div className="glass-strong flex flex-col gap-5 rounded-[22px] p-6 min-[960px]:col-span-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 font-mono text-[10.5px] text-acc">
          <span className="size-2 animate-[pulse_2s_infinite] rounded-full bg-acc" />
          currently building · bachelor thesis
        </span>
        <span className="rounded-full border border-line bg-seg2 px-2.5 py-[5px] font-mono text-[10.5px] text-mute">
          FH JOANNEUM · WS 26/27 + SS 27
        </span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div className="flex max-w-[560px] flex-col gap-2.5">
          <span className="wdth-112 text-[clamp(32px,3.4vw,52px)] leading-[.95] font-bold tracking-[-0.04em]">Overex</span>
          <span className="text-[15px] leading-[1.55] text-pretty text-mute">
            Flash-sale ticketing on Kubernetes. Thousands of buyers, one last ticket — the platform has to stay up and must
            never sell it twice. Spring Boot microservices, gRPC between services, RS256 JWTs from my AuthKit.
          </span>
        </div>
        <Link
          href="/work/overex"
          scroll={false}
          className="flex items-center gap-2.5 rounded-full bg-ink px-4 py-[11px] font-mono text-[11.5px] whitespace-nowrap text-bg hover:text-bg"
        >
          Deep dive <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2.5">
        <span className="font-mono text-[10.5px] text-mute">thesis — strategies against overselling, at 1 / 3 / 5 / 10 replicas</span>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
          {STRATEGIES.map((s) => (
            <div key={s.name} className={cn("flex flex-col gap-1.5 rounded-xl border bg-seg2 px-3.5 py-3", s.main ? "border-acc" : "border-line")}>
              <span className={cn("font-mono text-[10px]", s.main ? "text-acc" : "text-mute")}>{s.tag}</span>
              <span className="text-[15px] font-semibold">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="mr-1.5 font-mono text-[10.5px] text-mute">learning right now</span>
        {["Kubernetes", "gRPC", "Microservices"].map((t) => (
          <span key={t} className="rounded-full border border-acc px-[11px] py-1.5 font-mono text-[11px]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
