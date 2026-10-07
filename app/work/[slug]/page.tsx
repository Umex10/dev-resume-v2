import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeepDive } from "@/components/deep-dive/deep-dive";
import { DeepDiveHeader } from "@/components/deep-dive/deep-dive-header";
import { HydrationMark } from "@/components/hydration-mark";
import { PROJECTS } from "@/content/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.id === slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.kind}`,
    description: p.tagline,
    alternates: { canonical: `/work/${p.id}` },
    openGraph: { title: `${p.name} — deep dive`, description: p.tagline },
  };
}

/** Standalone, shareable deep dive (hard loads and crawlers). */
export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.id === slug);
  if (!p) notFound();
  return (
    <main id="main" className="px-2.5 pt-[84px] pb-10">
      <article className="glass-strong mx-auto w-[min(1080px,100%)] overflow-clip rounded-[24px]">
        <DeepDiveHeader id={p.id} mode="page" />
        <DeepDive project={p} />
      </article>
      <HydrationMark />
    </main>
  );
}
