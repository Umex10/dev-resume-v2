import { Suspense } from "react";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero/hero";
import { Opener } from "@/components/opener";
import { Ship } from "@/components/ship/ship";
import { Stack } from "@/components/stack/stack";
import { StatusHeader, StatusSkeleton, StatusTiles } from "@/components/status/status";
import { Shell } from "@/components/terminal/shell";
import { Work } from "@/components/work/work";
import { HydrationMark } from "@/components/hydration-mark";
import { getGitHubData } from "@/lib/github";

export default async function Home() {
  const gh = await getGitHubData();
  return (
    <>
      <Opener />
      <main id="main">
        <Hero />
        <Shell streak={gh.streak} />
        <Work repos={gh.repos} />
        <section
          id="status"
          aria-labelledby="status-title"
          className="section-pad relative box-border flex min-h-svh flex-col gap-[clamp(32px,5vh,56px)]"
        >
          <StatusHeader />
          <Suspense fallback={<StatusSkeleton />}>
            <StatusTiles />
          </Suspense>
        </section>
        <Ship run={gh.run} />
        <Stack />
        <Contact />
      </main>
      <HydrationMark />
    </>
  );
}
