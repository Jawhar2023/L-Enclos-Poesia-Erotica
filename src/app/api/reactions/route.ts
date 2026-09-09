import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { VISITOR_COOKIE } from "@/lib/admin";
import { getReactionState, toggleReaction, uid } from "@/lib/db";

export const dynamic = "force-dynamic";

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
  try {
    const state = await getReactionState(poemId, vid);
    return NextResponse.json(state);
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { poemId } = await req.json();
  if (!poemId) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const vid = await visitorId();
  try {
    const result = await toggleReaction(String(poemId), vid);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}