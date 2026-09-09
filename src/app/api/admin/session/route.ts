import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getStore } from "@/lib/db";
import { hasSupabase, hasSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false });
  }
  const store = await getStore();
  const poems = store.poems.map((p) => ({
    ...p,
    likes: store.reactions.filter((r) => r.poemId === p.id).length,
    comments: store.comments.filter((c) => c.poemId === p.id).length,
  }));
  const pending = store.submissions.filter((s) => s.status === "pending").length;
  return NextResponse.json({
    ok: true,
    supabase: hasSupabase(),
    supabaseAdmin: hasSupabaseAdmin(),
    poems,
    submissions: [...store.submissions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    comments: [...store.comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    reactions: [...store.reactions].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    stats: {
      poems: store.poems.length,
      likes: store.reactions.length,
      comments: store.comments.length,
      visitors: store.submissions.length,
      pending,
    },
  });
}
