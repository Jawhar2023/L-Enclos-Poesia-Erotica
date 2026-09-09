import { NextResponse } from "next/server";
import { randomAvatar } from "@/components/CommentAvatar";
import { addComment, listComments, uid } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const poemId = new URL(req.url).searchParams.get("poemId") || "";
  const comments = await listComments(poemId);
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
  try {
    await addComment(comment);
    return NextResponse.json({ comment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
