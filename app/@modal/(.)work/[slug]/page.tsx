import { notFound } from "next/navigation";
import { DeepDive } from "@/components/deep-dive/deep-dive";
import { DeepDiveSheet } from "@/components/deep-dive/deep-dive-sheet";
import { PROJECTS } from "@/content/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

/** Intercepted /work/[slug]: the deep dive slides in as a Sheet over the page. */
export default async function WorkModal({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.id === slug);
  if (!p) notFound();
  return (
    <DeepDiveSheet id={p.id}>
      <DeepDive project={p} />
    </DeepDiveSheet>
  );
}
