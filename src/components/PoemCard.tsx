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
      className="group alcove relative block overflow-hidden rounded-[1.6rem] p-6 transition hover:-translate-y-1"
    >
      <p className="font-display text-xs uppercase tracking-[0.22em] text-ink/45">
        {author}
      </p>
      <h3 className="mt-2 font-display text-2xl leading-snug">{title}</h3>
      <div
        className={`verse-veil mt-4 max-h-28 overflow-hidden font-display text-lg leading-8 text-ink/75 ${
          lang === "ar" ? "font-poem-ar" : ""
        }`}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <pre className="whitespace-pre-wrap">{verses}</pre>
      </div>
      <span className="mt-5 inline-block font-display text-sm text-ink/55 underline decoration-ink/20 underline-offset-4 group-hover:text-ink">
        {d.keepReading}…
      </span>
    </Link>
  );
}
