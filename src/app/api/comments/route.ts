import { NextResponse } from "next/server";
import { randomAvatar } from "@/components/CommentAvatar";
import { getStore, mutateStore, uid } from "@/lib/db";

export async function GET(req: Request) {
  const poemId = new URL(req.url).searchParams.get("poemId") || "";
  const store = await getStore();
  const comments = store.comments
    .filter((c) => c.poemId === poemId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ comments });
}

export async function POST(req: Request) {
  const { poemId, author, body } = await req.json();
  if (!poemId || !body?.trim()) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const name = String(author || "").trim().slice(0, 80);
  const comment = {
    id: uid(),
    poemId: String(poemId),
    author: name,
    body: String(body).slice(0, 2000),
    createdAt: new Date().toISOString(),
    avatar: randomAvatar(),
  };
  await mutateStore((s) => s.comments.push(comment));
  return NextResponse.json({ comment });
}
