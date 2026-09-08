import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { hasSupabaseAdmin, supabaseAdmin } from "@/lib/supabase";

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

  const { data, error } = await supabaseAdmin().rpc("exec_sql", { q: query });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const payload = data as { ok?: boolean; type?: string; rows?: unknown; rowCount?: number; error?: string };
  if (payload?.ok === false) {
    return NextResponse.json({ ok: false, error: payload.error || "SQL error" }, { status: 400 });
  }

  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  const columns = rows.length && rows[0] && typeof rows[0] === "object" ? Object.keys(rows[0] as object) : [];

  return NextResponse.json({
    ok: true,
    type: payload?.type || "ok",
    columns,
    rows,
    rowCount: payload?.rowCount ?? rows.length,
  });
}
