"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { excerpt } from "@/lib/excerpt";
import type { Poem } from "@/types";

export function PoemCard({ poem }: { poem: Poem }) {
  const { lang, d } = useLang();
  const title = lang === "ar" && poem.titleAr ? poem.titleAr : poem.titleFr;
  const author = lang === "ar" && poem.authorAr ? poem.authorAr : poem.authorFr;
  const verses = excerpt(lang === "ar" && poem.bodyAr ? poem.bodyAr : poem.bodyFr, 4);

  return (
    <Link
      href={`/poemes/${poem.id}`}
      className="group alcove relative block overflow-hidden rounded-[1.6rem] border-2 border-black/15 bg-paper p-7 shadow-sm transition hover:-translate-y-1 hover:border-black/40"
    >
      <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-black">
        {author}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold leading-snug text-black sm:text-3xl">{title}</h3>
      <div
        className={`verse-veil mt-4 max-h-32 overflow-hidden font-display text-xl font-medium leading-8 text-black ${
          lang === "ar" ? "font-poem-ar" : ""
        }`}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <pre className="whitespace-pre-wrap">{verses}</pre>
      </div>
      <span className="mt-5 inline-block font-display text-base font-bold text-black underline decoration-black/40 underline-offset-4 group-hover:decoration-black">
        {d.keepReading}…
      </span>
    </Link>
  );
}
