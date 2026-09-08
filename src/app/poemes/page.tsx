import { getCatalog } from "@/lib/catalog";
import { PoemsIndex } from "@/components/page-copy/PoemsIndex";

export const dynamic = "force-dynamic";

export default async function PoemsPage() {
  const poems = await getCatalog();
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <PoemsIndex poems={poems} />
    </div>
  );
}
