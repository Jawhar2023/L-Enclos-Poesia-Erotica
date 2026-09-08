import { NextResponse } from "next/server";
import { mutateStore, uid } from "@/lib/db";

export async function POST(req: Request) {
  const { author, titleFr, titleAr, bodyFr, bodyAr } = await req.json();
  if (!author?.trim() || (!bodyFr?.trim() && !bodyAr?.trim())) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await mutateStore((s) => {
    s.submissions.push({
      id: uid(),
      author: String(author).slice(0, 80),
      titleFr: String(titleFr || "").slice(0, 200),
      titleAr: String(titleAr || "").slice(0, 200),
      bodyFr: String(bodyFr || "").slice(0, 8000),
      bodyAr: String(bodyAr || "").slice(0, 8000),
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  });
  return NextResponse.json({ ok: true });
}
