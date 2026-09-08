import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminPassword } from "@/lib/admin";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== adminPassword()) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "ok", { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
  return NextResponse.json({ ok: true });
}
