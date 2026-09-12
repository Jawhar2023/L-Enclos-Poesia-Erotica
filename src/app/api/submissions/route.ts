import { NextResponse } from "next/server";
import { addSubmission, uid } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { author, title, body, titleFr, titleAr, bodyFr, bodyAr } = await req.json();
  const finalTitle = String(title || titleFr || titleAr || "").trim();
  const finalBody = String(body || bodyFr || bodyAr || "").trim();

  if (!author?.trim() || !finalBody) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  try {
    await addSubmission({
      id: uid(),
      author: String(author).slice(0, 80),
      titleFr: finalTitle.slice(0, 200),
      titleAr: (titleAr || finalTitle).slice(0, 200),
      bodyFr: finalBody.slice(0, 8000),
      bodyAr: (bodyAr || finalBody).slice(0, 8000),
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}