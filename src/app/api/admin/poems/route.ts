import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { mutateStore, uid } from "@/lib/db";

function payload(body: Record<string, unknown>) {
  return {
    titleFr: String(body.titleFr || ""),
    titleAr: String(body.titleAr || ""),
    authorFr: String(body.authorFr || "Abdelhamid Ladhari"),
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

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await req.json();
  if (!String(body.titleFr || "").trim() && !String(body.titleAr || "").trim()) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await mutateStore((s) => {
    s.poems.push({
      id: `p-${uid()}`,
      ...payload(body),
      createdAt: new Date().toISOString(),
    });
  });
  return NextResponse.json({ ok: true });
}
