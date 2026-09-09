import { NextResponse } from "next/server";
import { addSubmission, uid } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { author, titleFr, titleAr, bodyFr, bodyAr } = await req.json();
  if (!author?.trim() || (!bodyFr?.trim() && !bodyAr?.trim())) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  try {
    await addSubmission({
      id: uid(),
      author: String(author).slice(0, 80),
      titleFr: String(titleFr || "").slice(0, 200),
      titleAr: String(titleAr || "").slice(0, 200),
      bodyFr: String(bodyFr || "").slice(0, 8000),
      bodyAr: String(bodyAr || "").slice(0, 8000),
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}