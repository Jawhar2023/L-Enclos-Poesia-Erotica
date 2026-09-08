import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { mutateStore } from "@/lib/db";

function payload(body: Record<string, unknown>) {
  return {
    titleFr: String(body.titleFr || ""),
    titleAr: String(body.titleAr || ""),
    authorFr: String(body.authorFr || ""),
    authorAr: String(body.authorAr || ""),
    translatorFr: String(body.translatorFr || ""),
    translatorAr: String(body.translatorAr || ""),
    introFr: String(body.introFr || ""),
    introAr: String(body.introAr || ""),
    dedicationFr: String(body.dedicationFr || ""),
    dedicationAr: String(body.dedicationAr || ""),
    placeFr: String(body.placeFr || ""),
    placeAr: String(body.placeAr || ""),
    bodyFr: String(body.bodyFr || ""),
    bodyAr: String(body.bodyAr || ""),
  };
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const found = await mutateStore((s) => {
    const poem = s.poems.find((p) => p.id === id);
    if (!poem) return false;
    Object.assign(poem, payload(body));
    return true;
  });
  if (!found) return NextResponse.json({ error: "missing" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await mutateStore((s) => {
    s.poems = s.poems.filter((p) => p.id !== id);
    s.comments = s.comments.filter((c) => c.poemId !== id);
    s.reactions = s.reactions.filter((r) => r.poemId !== id);
  });
  return NextResponse.json({ ok: true });
}
