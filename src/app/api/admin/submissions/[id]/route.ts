import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { mutateStore } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const { status } = await req.json();
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await mutateStore((s) => {
    const item = s.submissions.find((x) => x.id === id);
    if (!item) return;
    item.status = status;
    if (status === "approved") {
      const poemId = `s-${item.id}`;
      if (!s.poems.some((p) => p.id === poemId)) {
        s.poems.push({
          id: poemId,
          titleFr: item.titleFr,
          titleAr: item.titleAr,
          authorFr: item.author,
          authorAr: item.author,
          bodyFr: item.bodyFr,
          bodyAr: item.bodyAr,
          createdAt: new Date().toISOString(),
        });
      }
    }
  });
  return NextResponse.json({ ok: true });
}
