import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { translateFrToAr } from "@/lib/translate";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { titleFr = "", authorFr = "", bodyFr = "" } = await req.json();
  if (!String(titleFr).trim() && !String(authorFr).trim() && !String(bodyFr).trim()) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  try {
    const [titleAr, authorAr, bodyAr] = await Promise.all([
      translateFrToAr(String(titleFr)),
      translateFrToAr(String(authorFr)),
      translateFrToAr(String(bodyFr)),
    ]);
    return NextResponse.json({ titleAr, authorAr, bodyAr });
  } catch {
    return NextResponse.json({ error: "translate" }, { status: 502 });
  }
}
