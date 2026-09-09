"use client";

import { CommentSection } from "@/components/CommentSection";
import { Ornament } from "@/components/Ornament";
import { PenWriting } from "@/components/PenWriting";
import { ReactionBar } from "@/components/ReactionBar";
import { useLang } from "@/context/LangContext";
import type { Comment, Poem } from "@/types";

export function PoemView({ poem, comments = [] }: { poem: Poem; comments?: Comment[] }) {
  const { lang, d } = useLang();
  const title = lang === "ar" && poem.titleAr ? poem.titleAr : poem.titleFr;
  const author = lang === "ar" && poem.authorAr ? poem.authorAr : poem.authorFr;
  const intro = lang === "ar" ? poem.introAr : poem.introFr;
  const dedication = lang === "ar" ? poem.dedicationAr : poem.dedicationFr;
  const place = lang === "ar" ? poem.placeAr : poem.placeFr;
  const hasBoth = Boolean(poem.bodyFr && poem.bodyAr);

  return (
    <article>
      <p className="font-display text-sm text-ink/55">{author}</p>
      <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
        <PenWriting
          key={`title-${poem.id}-${lang}`}
          text={title}
          rtl={lang === "ar"}
          className="font-display text-4xl leading-tight sm:text-5xl"
        />
      </h1>
      {poem.translatorFr ? (
        <p className="mt-3 text-ink/60">
          {d.translator} : {lang === "ar" ? poem.translatorAr : poem.translatorFr}
        </p>
      ) : null}
      <Ornament className="my-6 justify-start" />
      {intro ? <p className="max-w-2xl text-lg italic text-ink/70">{intro}</p> : null}
      {dedication ? <p className="mt-3 font-display text-lg">{dedication}</p> : null}

      <div className={`mt-10 grid gap-8 ${hasBoth ? "lg:grid-cols-2" : ""}`}>
        {poem.bodyFr ? (
          <div className="alcove rounded-[1.6rem] p-7" dir="ltr">
            {hasBoth ? (
              <p className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-ink/40">
                {d.original} FR
              </p>
            ) : null}
            <PenWriting key={`fr-${poem.id}`} text={poem.bodyFr} className="font-display text-xl leading-9" />
          </div>
        ) : null}
        {poem.bodyAr ? (
          <div className="alcove rounded-[1.6rem] p-7" dir="rtl">
            {hasBoth ? (
              <p className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-ink/40">
                {d.original} ع
              </p>
            ) : null}
            <PenWriting
              key={`ar-${poem.id}`}
              text={poem.bodyAr}
              rtl
              className="font-poem-ar text-xl leading-10"
            />
          </div>
        ) : null}
      </div>
      {place ? <p className="mt-6 text-sm text-ink/50">{place}</p> : null}
      <div className="mt-8">
        <ReactionBar poemId={poem.id} />
      </div>
      <CommentSection poemId={poem.id} initialComments={comments} />
    </article>
  );
}
