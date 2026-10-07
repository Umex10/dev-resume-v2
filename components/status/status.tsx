import { Reveal } from "@/components/reveal";
import { lastDots } from "@/lib/contributions";
import { getGitHubData } from "@/lib/github";
import { NowCard } from "./now-card";
import { SkylineTile } from "./skyline-tile";
import { StatTile } from "./stat-tile";

const GRID = "grid flex-1 grid-cols-[minmax(0,1fr)] gap-3.5 min-[960px]:grid-cols-[repeat(6,minmax(0,1fr))]";

export function StatusHeader() {
  return (
    <Reveal className="flex flex-col gap-[18px]">
      <span className="font-mono text-[11px] text-acc">04 / status</span>
      <h2 id="status-title" className="h2-display">
        By the numbers.
      </h2>
    </Reveal>
  );
}

/** Bento: skyline, grade, streak, Overex, repositories. GitHub-driven tiles are fetched on the server. */
export async function StatusTiles() {
  const gh = await getGitHubData();
  return (
    <Reveal className={GRID}>
      <SkylineTile levels={gh.levels} total={gh.total} />
      <StatTile label="Ø grade · MSD Kapfenberg">
        <div className="big-number">1.20</div>
        <div className="flex flex-col gap-2.5">
          <div className="relative h-1.5 rounded-[3px] bg-seg" role="img" aria-label="1.20 on a 1 to 5 scale, 1 is best">
            <span className="absolute inset-y-0 left-0 w-[5%] rounded-[3px] bg-acc" />
            <span className="absolute -top-[5px] left-[5%] h-4 w-0.5 bg-acc" />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-mute">
            <span>1 · best</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          <span className="text-sm text-mute">Software Engineering · FH JOANNEUM, Graz</span>
        </div>
      </StatTile>
      <StatTile label="contribution streak">
        <div className="flex items-baseline gap-3">
          <span className="big-number">{gh.longest}</span>
          <span className="font-mono text-xs text-mute">days · longest</span>
        </div>
        <div className="grid grid-cols-[repeat(14,1fr)] gap-1" aria-label="Last 14 days" role="img">
          {lastDots(gh.levels).map((o, i) => (
            <span key={i} className="aspect-square rounded-[3px] bg-acc" style={{ opacity: o }} />
          ))}
        </div>
      </StatTile>
      <NowCard />
      <StatTile
        href="https://github.com/Umex10?tab=repositories"
        label={
          <>
            <span>public repositories</span>
            <span aria-hidden="true">↗</span>
          </>
        }
      >
        <span className="big-number">{gh.repos}</span>
        <span className="flex flex-wrap gap-1.5">
          {[...gh.languages, "3 achievements"].map((t) => (
            <span key={t} className="rounded-full border border-line px-[9px] py-[5px] font-mono text-[10.5px]">
              {t}
            </span>
          ))}
        </span>
      </StatTile>
    </Reveal>
  );
}

/** Glass skeletons with a slow shimmer while GitHub data streams in. */
export function StatusSkeleton() {
  return (
    <div className={GRID} aria-busy="true" aria-label="Loading GitHub stats">
      <div className="skeleton min-h-[420px] rounded-[22px] border border-line min-[960px]:col-span-4 min-[960px]:row-span-2" />
      <div className="skeleton min-h-[260px] rounded-[22px] border border-line min-[960px]:col-span-2" />
      <div className="skeleton min-h-[260px] rounded-[22px] border border-line min-[960px]:col-span-2" />
      <div className="skeleton min-h-[320px] rounded-[22px] border border-line min-[960px]:col-span-4" />
      <div className="skeleton min-h-[320px] rounded-[22px] border border-line min-[960px]:col-span-2" />
    </div>
  );
}
