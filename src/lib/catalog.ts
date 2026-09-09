import { fetchPoemById, listApprovedCommunity, listPoems } from "@/lib/db";
import type { Poem } from "@/types";

function asPoem(p: Awaited<ReturnType<typeof listPoems>>[number], source: Poem["source"]): Poem {
  return { ...p, source };
}

export async function getLibraryPoems(): Promise<Poem[]> {
  const poems = await listPoems();
  return poems.map((p) => asPoem(p, "admin"));
}

export async function getCatalog(): Promise<Poem[]> {
  const [library, community] = await Promise.all([getLibraryPoems(), listApprovedCommunity()]);
  const known = new Set(library.map((p) => p.id));
  const extra: Poem[] = community
    .map((p) => asPoem(p, "community"))
    .filter((p) => !known.has(p.id));
  return [...library, ...extra];
}

export async function getPoem(id: string) {
  const row = await fetchPoemById(id);
  if (row) return asPoem(row, "admin");
  if (id.startsWith("s-")) {
    const community = await listApprovedCommunity();
    const found = community.find((p) => p.id === id);
    return found ? asPoem(found, "community") : undefined;
  }
  return undefined;
}
