"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { doorForIndex, excerpt, ROMAN } from "@/lib/excerpt";
import type { Poem } from "@/types";

const tones = {
  pistachio: {
    glow: "door-glow-pistachio",
    chip: "bg-pistachio/70",
    wash: "from-pistachio/40 via-paper to-paper",
  },
  sky: {
    glow: "door-glow-sky",
    chip: "bg-sky/70",
    wash: "from-sky/40 via-paper to-paper",
  },
  rose: {
    glow: "door-glow-rose",
    chip: "bg-rose/70",
    wash: "from-rose/40 via-paper to-paper",
  },
  butter: {
    glow: "door-glow-butter",
    chip: "bg-butter/80",
    wash: "from-butter/50 via-paper to-paper",
  },
} as const;

export function FeaturedSalon({ poems }: { poems: Poem[] }) {
  const { lang, d } = useLang();
  const [hero, ...rest] = poems;
  if (!hero) return null;

  return (
    <section className="relative px-4 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.42em] text-ink/45">
          {d.doorLabel} I — {ROMAN[poems.length - 1] || poems.length}
        </p>
        <h2 className="mt-3 font-display text-4xl sm:text-6xl">{d.featured}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ink/65">{d.featuredLead}</p>
        <div className="gold-rule mx-auto mt-6 h-px w-48" />
      </div>

      <HeroDoor poem={hero} index={0} />

      <div className="mx-auto mt-10 grid max-w-6xl gap-7 lg:grid-cols-2">
        {rest.map((poem, i) => (
          <DoorCard
            key={poem.id}
            poem={poem}
            index={i + 1}
            wide={i === rest.length - 1 && rest.length % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

function HeroDoor({ poem, index }: { poem: Poem; index: number }) {
  const { lang, d } = useLang();
  const meta = doorForIndex(index);
  const tone = tones[meta.tone];
  const title = lang === "ar" && poem.titleAr ? poem.titleAr : poem.titleFr;
  const author = lang === "ar" && poem.authorAr ? poem.authorAr : poem.authorFr;
  const verses = excerpt(lang === "ar" && poem.bodyAr ? poem.bodyAr : poem.bodyFr, 8);
  const whisper = lang === "ar" ? excerpt(poem.bodyFr, 3) : excerpt(poem.bodyAr, 3);

  return (
    <Link
      href={`/poemes/${poem.id}`}
      className={`group relative mx-auto mt-12 block max-w-6xl overflow-hidden rounded-[2rem] ${tone.glow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tone.wash}`} />
      <div className="relative grid min-h-[520px] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-end p-8 sm:p-12">
          <span className={`inline-flex w-fit rounded-full ${tone.chip} px-3 py-1 font-display text-sm`}>
            {d.doorLabel} {meta.numeral}
          </span>
          <p className="mt-5 font-display text-sm uppercase tracking-[0.28em] text-ink/50">{author}</p>
          <h3 className="mt-2 font-display text-4xl leading-tight sm:text-6xl">{title}</h3>
          <div
            className={`verse-veil mt-8 max-h-56 overflow-hidden font-display text-2xl leading-10 sm:text-3xl ${
              lang === "ar" ? "font-poem-ar" : ""
            }`}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <pre className="whitespace-pre-wrap">{verses}</pre>
          </div>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2 font-display text-paper transition group-hover:bg-ink/80">
            {d.openDoor} <span aria-hidden>⟶</span>
          </span>
        </div>
        <div className="relative hidden overflow-hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portraits/ninon-bussy.jpg"
            alt=""
            className="h-full w-full object-cover object-top opacity-80 transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-paper/10 to-paper" />
          {whisper ? (
            <p
              className="absolute bottom-8 left-8 right-8 font-poem-ar text-lg leading-9 text-ink/70"
              dir={lang === "ar" ? "ltr" : "rtl"}
            >
              {whisper}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function DoorCard({ poem, wide, index }: { poem: Poem; wide?: boolean; index: number }) {
  const { lang, d } = useLang();
  const meta = doorForIndex(index);
  const tone = tones[meta.tone];
  const title = lang === "ar" && poem.titleAr ? poem.titleAr : poem.titleFr;
  const author = lang === "ar" && poem.authorAr ? poem.authorAr : poem.authorFr;
  const verses = excerpt(lang === "ar" && poem.bodyAr ? poem.bodyAr : poem.bodyFr, 5);

  return (
    <Link
      href={`/poemes/${poem.id}`}
      className={`group alcove relative overflow-hidden rounded-[1.7rem] p-7 transition duration-500 hover:-translate-y-1 ${tone.glow} ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${tone.wash} opacity-80`} />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className={`rounded-full ${tone.chip} px-3 py-1 font-display text-xs tracking-widest`}>
            {d.doorLabel} {meta.numeral}
          </span>
          <span className="font-display text-sm text-ink/40">{author}</span>
        </div>
        <h3 className="mt-4 font-display text-3xl leading-tight">{title}</h3>
        <div
          className={`verse-veil mt-5 max-h-40 overflow-hidden font-display text-xl leading-9 text-ink/80 ${
            lang === "ar" ? "font-poem-ar" : ""
          }`}
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <pre className="whitespace-pre-wrap">{verses}</pre>
        </div>
        <p className="mt-6 font-display text-sm tracking-wide text-ink/55 underline decoration-ink/20 underline-offset-4 group-hover:text-ink">
          {d.keepReading}…
        </p>
      </div>
    </Link>
  );
}
