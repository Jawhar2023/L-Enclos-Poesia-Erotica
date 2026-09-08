import { notFound } from "next/navigation";
import { getPoem } from "@/lib/catalog";
import { PoemView } from "@/components/page-copy/PoemView";

export const dynamic = "force-dynamic";

export default async function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poem = await getPoem(id);
  if (!poem) notFound();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <PoemView poem={poem} />
    </div>
  );
}
