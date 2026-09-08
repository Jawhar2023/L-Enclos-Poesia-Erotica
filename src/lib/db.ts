import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { officialPoems } from "@/data/poems";
import { hasSupabaseAdmin, supabaseAdmin } from "@/lib/supabase";
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

async function seedSupabase() {
  const db = supabaseAdmin();
  const { count, error } = await db.from("poems").select("id", { count: "exact", head: true });
  if (error) throw error;
  if (count && count > 0) return;
  const json = readJsonStore();
  const poems = json.poems.length ? json.poems : officialAsAdmin();
  await persistSupabase({
    poems,
    comments: json.comments || [],
    reactions: json.reactions || [],
    submissions: json.submissions || [],
    adminPoems: [],
    seeded: true,
  });
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
    comments: (comments.data || []).map((row) => ({
      id: String(row.id),
      poemId: String(row.poem_id),
      author: String(row.author || ""),
      body: String(row.body || ""),
      createdAt: String(row.created_at),
      avatar: row.avatar ? String(row.avatar) : undefined,
    })),
    reactions: (reactions.data || []).map((row) => ({
      id: String(row.id),
      poemId: String(row.poem_id),
      visitorId: String(row.visitor_id),
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

async function persistSupabase(store: StoreData) {
  const db = supabaseAdmin();
  const poemRows = store.poems.map(poemToRow);
  const commentRows = store.comments.map((c: Comment) => ({
    id: c.id,
    poem_id: c.poemId,
    author: c.author,
    body: c.body,
    avatar: c.avatar || null,
    created_at: c.createdAt,
  }));
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

  const ids = {
    poems: new Set(store.poems.map((p) => p.id)),
    comments: new Set(store.comments.map((c) => c.id)),
    reactions: new Set(store.reactions.map((r) => r.id)),
    submissions: new Set(store.submissions.map((s) => s.id)),
  };

  const [existingPoems, existingComments, existingReactions, existingSubs] = await Promise.all([
    db.from("poems").select("id"),
    db.from("comments").select("id"),
    db.from("reactions").select("id"),
    db.from("submissions").select("id"),
  ]);

  const del = async (table: keyof typeof ids, rows: { id: string }[] | null) => {
    const gone = (rows || []).map((r) => r.id).filter((id) => !ids[table].has(id));
    if (gone.length) await db.from(table).delete().in("id", gone);
  };

  await del("comments", existingComments.data);
  await del("reactions", existingReactions.data);
  await del("submissions", existingSubs.data);
  await del("poems", existingPoems.data);

  if (poemRows.length) await db.from("poems").upsert(poemRows);
  if (commentRows.length) await db.from("comments").upsert(commentRows);
  if (reactionRows.length) await db.from("reactions").upsert(reactionRows);
  if (submissionRows.length) await db.from("submissions").upsert(submissionRows);
}

export async function getStore() {
  if (hasSupabaseAdmin()) return readSupabaseStore();
  return readJsonStore();
}

export async function mutateStore<T>(fn: (store: StoreData) => T): Promise<T> {
  const store = await getStore();
  const result = fn(store);
  if (hasSupabaseAdmin()) await persistSupabase(store);
  else writeJsonStore(store);
  return result;
}
