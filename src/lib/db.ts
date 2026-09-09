import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { officialPoems } from "@/data/poems";
import { hasSupabase, hasSupabaseAdmin, supabaseAdmin } from "@/lib/supabase";
import type { AdminPoem, Comment, Reaction, StoreData, Submission } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "store.json");

const emptyStore = (): StoreData => ({
  comments: [],
  reactions: [],
  submissions: [],
  adminPoems: [],
  poems: [],
  seeded: false,
});

export function uid() {
  return randomUUID();
}

function officialAsAdmin(): AdminPoem[] {
  return officialPoems.map((p) => ({
    id: p.id,
    titleFr: p.titleFr,
    titleAr: p.titleAr,
    authorFr: p.authorFr,
    authorAr: p.authorAr,
    translatorFr: p.translatorFr,
    translatorAr: p.translatorAr,
    introFr: p.introFr,
    introAr: p.introAr,
    dedicationFr: p.dedicationFr,
    dedicationAr: p.dedicationAr,
    placeFr: p.placeFr,
    placeAr: p.placeAr,
    bodyFr: p.bodyFr,
    bodyAr: p.bodyAr,
    createdAt: "2000-01-01T00:00:00.000Z",
  }));
}

function seedIfNeeded(store: StoreData) {
  if (store.seeded) return false;
  const official = officialAsAdmin();
  const extras: AdminPoem[] = (store.adminPoems || []).map((p) => ({
    ...p,
    id: p.id.startsWith("a-") ? p.id : `a-${p.id}`,
  }));
  const seen = new Set(official.map((p) => p.id));
  store.poems = [...official, ...extras.filter((p) => !seen.has(p.id))];
  store.seeded = true;
  return true;
}

function readJsonStore(): StoreData {
  let store = emptyStore();
  if (existsSync(DB_PATH)) {
    try {
      store = { ...emptyStore(), ...JSON.parse(readFileSync(DB_PATH, "utf8")) };
      if (!Array.isArray(store.poems)) store.poems = [];
    } catch {
      store = emptyStore();
    }
  }
  if (seedIfNeeded(store)) writeJsonStore(store);
  return store;
}

function writeJsonStore(store: StoreData) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(store, null, 2), "utf8");
}

function poemFromRow(row: Record<string, unknown>): AdminPoem {
  return {
    id: String(row.id),
    titleFr: String(row.title_fr || ""),
    titleAr: String(row.title_ar || ""),
    authorFr: String(row.author_fr || ""),
    authorAr: String(row.author_ar || ""),
    translatorFr: String(row.translator_fr || ""),
    translatorAr: String(row.translator_ar || ""),
    introFr: String(row.intro_fr || ""),
    introAr: String(row.intro_ar || ""),
    dedicationFr: String(row.dedication_fr || ""),
    dedicationAr: String(row.dedication_ar || ""),
    placeFr: String(row.place_fr || ""),
    placeAr: String(row.place_ar || ""),
    bodyFr: String(row.body_fr || ""),
    bodyAr: String(row.body_ar || ""),
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

function poemToRow(p: AdminPoem) {
  const featured = officialPoems.some((o) => o.id === p.id && o.featured);
  return {
    id: p.id,
    title_fr: p.titleFr || "",
    title_ar: p.titleAr || "",
    author_fr: p.authorFr || "",
    author_ar: p.authorAr || "",
    translator_fr: p.translatorFr || "",
    translator_ar: p.translatorAr || "",
    intro_fr: p.introFr || "",
    intro_ar: p.introAr || "",
    dedication_fr: p.dedicationFr || "",
    dedication_ar: p.dedicationAr || "",
    place_fr: p.placeFr || "",
    place_ar: p.placeAr || "",
    body_fr: p.bodyFr || "",
    body_ar: p.bodyAr || "",
    featured,
    created_at: p.createdAt,
  };
}

let poemsCache: { at: number; poems: AdminPoem[] } | null = null;

export function invalidatePoemsCache() {
  poemsCache = null;
}

async function seedSupabase() {
  const db = supabaseAdmin();
  const { count, error } = await db.from("poems").select("id", { count: "exact", head: true });
  if (error) throw error;
  if (count && count > 0) return;
  if (!hasSupabaseAdmin()) return;
  const json = readJsonStore();
  const poems = json.poems.length ? json.poems : officialAsAdmin();
  await persistSupabase(
    {
      poems,
      comments: json.comments || [],
      reactions: json.reactions || [],
      submissions: json.submissions || [],
      adminPoems: [],
      seeded: true,
    },
    { poems: [], comments: [], reactions: [], submissions: [] },
  );
}

async function readSupabaseStore(): Promise<StoreData> {
  await seedSupabase();
  const db = supabaseAdmin();
  const [poems, comments, reactions, submissions] = await Promise.all([
    db.from("poems").select("*").order("created_at", { ascending: true }),
    db.from("comments").select("*").order("created_at", { ascending: false }),
    db.from("reactions").select("*"),
    db.from("submissions").select("*").order("created_at", { ascending: false }),
  ]);
  if (poems.error) throw poems.error;
  if (comments.error) throw comments.error;
  if (reactions.error) throw reactions.error;
  if (submissions.error) throw submissions.error;

  return {
    poems: (poems.data || []).map((row) => poemFromRow(row as Record<string, unknown>)),
    comments: (comments.data || []).map((row) => commentFromRow(row as Record<string, unknown>)),
    reactions: (reactions.data || []).map((row) => ({
      id: String(row.id),
      poemId: String(row.poem_id),
      visitorId: String(row.visitor_id),
      createdAt: row.created_at ? String(row.created_at) : undefined,
    })),
    submissions: (submissions.data || []).map((row) => ({
      id: String(row.id),
      author: String(row.author || ""),
      titleFr: String(row.title_fr || ""),
      titleAr: String(row.title_ar || ""),
      bodyFr: String(row.body_fr || ""),
      bodyAr: String(row.body_ar || ""),
      status: (row.status as Submission["status"]) || "pending",
      createdAt: String(row.created_at),
    })),
    adminPoems: [],
    seeded: true,
  };
}

type IdSets = {
  poems: Set<string>;
  comments: Set<string>;
  reactions: Set<string>;
  submissions: Set<string>;
};

function snapshotIds(store: StoreData): IdSets {
  return {
    poems: new Set(store.poems.map((p) => p.id)),
    comments: new Set(store.comments.map((c) => c.id)),
    reactions: new Set(store.reactions.map((r) => r.id)),
    submissions: new Set(store.submissions.map((s) => s.id)),
  };
}

function removedIds(before: IdSets, store: StoreData) {
  const after = snapshotIds(store);
  const gone = (key: keyof IdSets) => [...before[key]].filter((id) => !after[key].has(id));
  return {
    poems: gone("poems"),
    comments: gone("comments"),
    reactions: gone("reactions"),
    submissions: gone("submissions"),
  };
}

function commentFromRow(row: Record<string, unknown>): Comment {
  return {
    id: String(row.id),
    poemId: String(row.poem_id),
    author: String(row.author || ""),
    body: String(row.body || ""),
    createdAt: String(row.created_at),
    avatar: row.avatar ? String(row.avatar) : undefined,
  };
}

function commentToRow(c: Comment) {
  return {
    id: c.id,
    poem_id: c.poemId,
    author: c.author,
    body: c.body,
    avatar: c.avatar || null,
    created_at: c.createdAt,
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

async function persistSupabase(store: StoreData, removed: ReturnType<typeof removedIds>) {
  const db = supabaseAdmin();
  const poemRows = store.poems.map(poemToRow);
  const commentRows = store.comments.map(commentToRow);
  const reactionRows = store.reactions.map((r: Reaction) => ({
    id: r.id,
    poem_id: r.poemId,
    visitor_id: r.visitorId,
  }));
  const submissionRows = store.submissions.map((s: Submission) => ({
    id: s.id,
    author: s.author,
    title_fr: s.titleFr,
    title_ar: s.titleAr,
    body_fr: s.bodyFr,
    body_ar: s.bodyAr,
    status: s.status,
    created_at: s.createdAt,
  }));

  const del = async (table: keyof typeof removed) => {
    if (!removed[table].length) return;
    const { error } = await db.from(table).delete().in("id", removed[table]);
    throwIfError(error);
  };

  await del("comments");
  await del("reactions");
  await del("submissions");
  await del("poems");

  const upsert = async (table: string, rows: object[]) => {
    if (!rows.length) return;
    const { error } = await db.from(table).upsert(rows);
    throwIfError(error);
  };

  await upsert("poems", poemRows);
  await upsert("comments", commentRows);
  await upsert("reactions", reactionRows);
  await upsert("submissions", submissionRows);
}

async function ensurePoemRow(poemId: string) {
  const db = supabaseAdmin();
  const existing = await db.from("poems").select("id").eq("id", poemId).maybeSingle();
  if (existing.error && existing.error.code !== "PGRST116") throwIfError(existing.error);
  if (existing.data?.id) return;

  const json = readJsonStore();
  const extras: AdminPoem[] = (json.adminPoems || []).map((p) => ({
    ...p,
    id: p.id.startsWith("a-") ? p.id : `a-${p.id}`,
  }));
  const poem =
    json.poems.find((p) => p.id === poemId) ||
    officialAsAdmin().find((p) => p.id === poemId) ||
    extras.find((p) => p.id === poemId);

  if (poem) {
    const { error } = await db.from("poems").upsert(poemToRow(poem));
    throwIfError(error);
    return;
  }

  if (poemId.startsWith("s-")) {
    const sub = await db.from("submissions").select("*").eq("id", poemId.slice(2)).maybeSingle();
    throwIfError(sub.error);
    if (sub.data) {
      const { error } = await db.from("poems").upsert({
        id: poemId,
        title_fr: String(sub.data.title_fr || ""),
        title_ar: String(sub.data.title_ar || ""),
        author_fr: String(sub.data.author || ""),
        author_ar: String(sub.data.author || ""),
        body_fr: String(sub.data.body_fr || ""),
        body_ar: String(sub.data.body_ar || ""),
        featured: false,
        created_at: sub.data.created_at,
      });
      throwIfError(error);
      return;
    }
  }

  const { error } = await db.from("poems").insert({
    id: poemId,
    title_fr: "",
    title_ar: "",
    author_fr: "",
    author_ar: "",
    body_fr: "",
    body_ar: "",
  });
  if (error && !/duplicate|already exists/i.test(error.message)) throwIfError(error);
}

export async function getStore() {
  if (hasSupabase()) return readSupabaseStore();
  return readJsonStore();
}

export async function listPoems(): Promise<AdminPoem[]> {
  if (!hasSupabase()) return readJsonStore().poems;
  if (poemsCache && Date.now() - poemsCache.at < 20_000) return poemsCache.poems;
  const { data, error } = await supabaseAdmin()
    .from("poems")
    .select("*")
    .order("created_at", { ascending: true });
  throwIfError(error);
  const poems = (data || []).map((row) => poemFromRow(row as Record<string, unknown>));
  poemsCache = { at: Date.now(), poems };
  return poems;
}

export async function fetchPoemById(id: string): Promise<AdminPoem | undefined> {
  if (!hasSupabase()) return readJsonStore().poems.find((p) => p.id === id);
  const { data, error } = await supabaseAdmin().from("poems").select("*").eq("id", id).maybeSingle();
  if (error && error.code !== "PGRST116") throwIfError(error);
  return data ? poemFromRow(data as Record<string, unknown>) : undefined;
}

export async function listApprovedCommunity(): Promise<AdminPoem[]> {
  if (!hasSupabase()) {
    return readJsonStore()
      .submissions.filter((s) => s.status === "approved")
      .map((s) => ({
        id: `s-${s.id}`,
        titleFr: s.titleFr,
        titleAr: s.titleAr,
        authorFr: s.author,
        authorAr: s.author,
        bodyFr: s.bodyFr,
        bodyAr: s.bodyAr,
        createdAt: s.createdAt,
      }));
  }
  const { data, error } = await supabaseAdmin()
    .from("submissions")
    .select("id, author, title_fr, title_ar, body_fr, body_ar, created_at")
    .eq("status", "approved");
  throwIfError(error);
  return (data || []).map((s) => ({
    id: `s-${s.id}`,
    titleFr: String(s.title_fr || ""),
    titleAr: String(s.title_ar || ""),
    authorFr: String(s.author || ""),
    authorAr: String(s.author || ""),
    bodyFr: String(s.body_fr || ""),
    bodyAr: String(s.body_ar || ""),
    createdAt: String(s.created_at || new Date().toISOString()),
  }));
}

export async function listComments(poemId: string): Promise<Comment[]> {
  if (hasSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("comments")
      .select("*")
      .eq("poem_id", poemId)
      .order("created_at", { ascending: false });
    throwIfError(error);
    return (data || []).map((row) => commentFromRow(row as Record<string, unknown>));
  }
  return readJsonStore()
    .comments.filter((c) => c.poemId === poemId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addComment(comment: Comment) {
  if (hasSupabase()) {
    const db = supabaseAdmin();
    const first = await db.from("comments").insert(commentToRow(comment));
    if (first.error) {
      await ensurePoemRow(comment.poemId);
      const { error } = await db.from("comments").insert(commentToRow(comment));
      throwIfError(error);
    }
    return comment;
  }
  const store = readJsonStore();
  store.comments.push(comment);
  writeJsonStore(store);
  return comment;
}

export async function removeComment(id: string) {
  if (hasSupabaseAdmin()) {
    const { error } = await supabaseAdmin().from("comments").delete().eq("id", id);
    throwIfError(error);
    return;
  }
  const store = readJsonStore();
  store.comments = store.comments.filter((c) => c.id !== id);
  writeJsonStore(store);
}

export async function removeReaction(id: string) {
  if (hasSupabase()) {
    const { error } = await supabaseAdmin().from("reactions").delete().eq("id", id);
    throwIfError(error);
    return;
  }
  const store = readJsonStore();
  store.reactions = store.reactions.filter((r) => r.id !== id);
  writeJsonStore(store);
}

export async function getReactionState(poemId: string, visitorId: string) {
  if (hasSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("reactions")
      .select("visitor_id")
      .eq("poem_id", poemId);
    throwIfError(error);
    const rows = data || [];
    return {
      count: rows.length,
      mine: rows.some((row) => String(row.visitor_id) === visitorId),
    };
  }
  const all = readJsonStore().reactions.filter((r) => r.poemId === poemId);
  return {
    count: all.length,
    mine: all.some((r) => r.visitorId === visitorId),
  };
}

export async function toggleReaction(poemId: string, visitorId: string) {
  if (hasSupabase()) {
    const db = supabaseAdmin();
    const listed = await db.from("reactions").select("id, visitor_id").eq("poem_id", poemId);
    throwIfError(listed.error);
    const rows = listed.data || [];
    const mine = rows.find((row) => String(row.visitor_id) === visitorId);

    if (mine) {
      const { error } = await db.from("reactions").delete().eq("id", mine.id);
      throwIfError(error);
      return { count: Math.max(0, rows.length - 1), mine: false };
    }

    const inserted = await db.from("reactions").insert({
      id: uid(),
      poem_id: poemId,
      visitor_id: visitorId,
    });
    if (inserted.error) {
      await ensurePoemRow(poemId);
      const { error } = await db.from("reactions").insert({
        id: uid(),
        poem_id: poemId,
        visitor_id: visitorId,
      });
      throwIfError(error);
    }
    return { count: rows.length + 1, mine: true };
  }

  const store = readJsonStore();
  const i = store.reactions.findIndex((r) => r.poemId === poemId && r.visitorId === visitorId);
  if (i >= 0) store.reactions.splice(i, 1);
  else store.reactions.push({ id: uid(), poemId, visitorId });
  writeJsonStore(store);
  const all = store.reactions.filter((r) => r.poemId === poemId);
  return { count: all.length, mine: all.some((r) => r.visitorId === visitorId) };
}

export async function addSubmission(entry: Submission) {
  if (hasSupabase()) {
    const { error } = await supabaseAdmin().from("submissions").insert({
      id: entry.id,
      author: entry.author,
      title_fr: entry.titleFr,
      title_ar: entry.titleAr,
      body_fr: entry.bodyFr,
      body_ar: entry.bodyAr,
      status: entry.status,
      created_at: entry.createdAt,
    });
    throwIfError(error);
    return;
  }
  const store = readJsonStore();
  store.submissions.push(entry);
  writeJsonStore(store);
}

export async function mutateStore<T>(fn: (store: StoreData) => T): Promise<T> {
  const store = await getStore();
  const before = snapshotIds(store);
  const result = fn(store);
  if (hasSupabaseAdmin()) {
    await persistSupabase(store, removedIds(before, store));
    invalidatePoemsCache();
  } else if (hasSupabase()) {
    throw new Error("Admin writes need SUPABASE_SECRET_KEY");
  } else writeJsonStore(store);
  return result;
}
