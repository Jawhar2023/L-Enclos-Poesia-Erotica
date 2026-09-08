import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { VISITOR_COOKIE } from "@/lib/admin";
import { getStore, mutateStore, uid } from "@/lib/db";

async function visitorId() {
  const jar = await cookies();
  let id = jar.get(VISITOR_COOKIE)?.value;
  if (!id) {
    id = uid();
    jar.set(VISITOR_COOKIE, id, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return id;
}

export async function GET(req: Request) {
  const poemId = new URL(req.url).searchParams.get("poemId") || "";
  const vid = await visitorId();
  const store = await getStore();
  const all = store.reactions.filter((r) => r.poemId === poemId);
  return NextResponse.json({
    count: all.length,
    mine: all.some((r) => r.visitorId === vid),
  });
}

export async function POST(req: Request) {
  const { poemId } = await req.json();
  if (!poemId) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const vid = await visitorId();
  const result = await mutateStore((s) => {
    const i = s.reactions.findIndex((r) => r.poemId === poemId && r.visitorId === vid);
    if (i >= 0) s.reactions.splice(i, 1);
    else s.reactions.push({ id: uid(), poemId, visitorId: vid });
    const all = s.reactions.filter((r) => r.poemId === poemId);
    return { count: all.length, mine: all.some((r) => r.visitorId === vid) };
  });
  return NextResponse.json(result);
}
