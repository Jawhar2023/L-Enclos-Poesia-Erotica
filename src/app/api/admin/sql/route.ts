import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { SCHEMA_SQL, SQL_TABLES } from "@/lib/sql-workbench";
import { hasSupabaseAdmin, supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function sqlPayload(data: unknown) {
  return data as {
    ok?: boolean;
    type?: string;
    rows?: unknown;
    rowCount?: number;
    error?: string;
  };
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasSupabaseAdmin()) {
    return NextResponse.json({ ok: false, connected: false });
  }

  const db = supabaseAdmin();
  const [
    poemCount,
    commentCount,
    likeCount,
    subCount,
    pendingCount,
    poems,
    comments,
    likes,
    submissions,
    schemaRpc,
  ] = await Promise.all([
    db.from("poems").select("id", { count: "exact", head: true }),
    db.from("comments").select("id", { count: "exact", head: true }),
    db.from("reactions").select("id", { count: "exact", head: true }),
    db.from("submissions").select("id", { count: "exact", head: true }),
    db.from("submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("poems").select("id, title_fr, title_ar"),
    db.from("comments").select("id, poem_id, author, body, created_at").order("created_at", { ascending: false }).limit(8),
    db.from("reactions").select("id, poem_id, visitor_id, created_at").order("created_at", { ascending: false }).limit(8),
    db
      .from("submissions")
      .select("id, author, title_fr, title_ar, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    db.rpc("exec_sql", { q: SCHEMA_SQL }),
  ]);

  const titles = new Map(
    (poems.data || []).map((p) => [String(p.id), String(p.title_fr || p.title_ar || p.id)]),
  );

  const schema = sqlPayload(schemaRpc.data);
  const schemaRows = Array.isArray(schema?.rows) ? (schema.rows as Record<string, string>[]) : [];
  const columnsByTable: Record<string, { name: string; type: string; nullable: string }[]> = {};
  for (const name of SQL_TABLES) columnsByTable[name] = [];
  for (const row of schemaRows) {
    const table = String(row.table_name || "");
    if (!columnsByTable[table]) columnsByTable[table] = [];
    columnsByTable[table].push({
      name: String(row.column_name || ""),
      type: String(row.data_type || ""),
      nullable: String(row.is_nullable || ""),
    });
  }

  const counts: Record<string, number> = {
    poems: poemCount.count ?? 0,
    comments: commentCount.count ?? 0,
    reactions: likeCount.count ?? 0,
    submissions: subCount.count ?? 0,
  };

  return NextResponse.json({
    ok: true,
    connected: true,
    stats: {
      poems: counts.poems,
      likes: counts.reactions,
      comments: counts.comments,
      submissions: counts.submissions,
      pending: pendingCount.count ?? 0,
    },
    tables: SQL_TABLES.map((name) => ({
      name,
      count: counts[name] ?? 0,
      columns: columnsByTable[name] || [],
    })),
    activity: {
      likes: (likes.data || []).map((row) => ({
        ...row,
        poem_title: titles.get(String(row.poem_id)) || row.poem_id,
      })),
      comments: (comments.data || []).map((row) => ({
        ...row,
        poem_title: titles.get(String(row.poem_id)) || row.poem_id,
      })),
      submissions: submissions.data || [],
    },
  });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasSupabaseAdmin()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Add the Supabase secret key (sb_secret_...) to SUPABASE_SECRET_KEY in .env, then restart.",
      },
      { status: 400 },
    );
  }

  const { sql } = await req.json();
  const query = String(sql || "").trim();
  if (!query) {
    return NextResponse.json({ ok: false, error: "Empty query" }, { status: 400 });
  }

  const started = Date.now();
  const { data, error } = await supabaseAdmin().rpc("exec_sql", { q: query });
  const ms = Date.now() - started;
  if (error) {
    return NextResponse.json({ ok: false, error: error.message, ms }, { status: 400 });
  }

  const payload = sqlPayload(data);
  if (payload?.ok === false) {
    return NextResponse.json({ ok: false, error: payload.error || "SQL error", ms }, { status: 400 });
  }

  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  const columns =
    rows.length && rows[0] && typeof rows[0] === "object" ? Object.keys(rows[0] as object) : [];

  return NextResponse.json({
    ok: true,
    type: payload?.type || "ok",
    columns,
    rows,
    rowCount: payload?.rowCount ?? rows.length,
    ms,
  });
}
