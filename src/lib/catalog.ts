import { getStore } from "@/lib/db";
import type { Poem } from "@/types";

export async function getLibraryPoems(): Promise<Poem[]> {
  const store = await getStore();
  return store.poems.map((p) => ({
    ...p,
    source: "admin" as const,
  }));
}

export async function getCatalog(): Promise<Poem[]> {
  const store = await getStore();
  const library = store.poems.map((p) => ({
    ...p,
    source: "admin" as const,
  }));
  const known = new Set(library.map((p) => p.id));
  const community: Poem[] = store.submissions
    .filter((s) => s.status === "approved")
    .map((s) => ({
      id: `s-${s.id}`,
      titleFr: s.titleFr,
      titleAr: s.titleAr,
      authorFr: s.author,
      authorAr: s.author,
      bodyFr: s.bodyFr,
      bodyAr: s.bodyAr,
      source: "community" as const,
    }))
    .filter((p) => !known.has(p.id));
  return [...library, ...community];
}

export async function getPoem(id: string) {
  const catalog = await getCatalog();
  return catalog.find((p) => p.id === id);
}
