import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { mutateStore } from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await mutateStore((s) => {
    s.comments = s.comments.filter((c) => c.id !== id);
  });
  return NextResponse.json({ ok: true });
}
