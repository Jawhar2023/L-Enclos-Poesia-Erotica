"use client";

import Link from "next/link";
import { GateMark } from "@/components/GateMark";
import { useLang } from "@/context/LangContext";

export function HeroSalon() {
  const { d } = useLang();

  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/portraits/ninon-cazenave.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[50%_18%] opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-cream/75 to-cream" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky/40 blur-3xl" />
      <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-rose/35 blur-3xl" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col items-center justify-center px-4 py-24 text-center">
        <GateMark className="h-14 w-14" />
        <p className="mt-6 font-display text-xs uppercase tracking-[0.45em] text-ink/55">
          {d.heroKicker}
        </p>
        <h2 className="mt-5 font-display text-5xl leading-[0.95] sm:text-7xl md:text-8xl">
          {d.siteName}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 sm:text-xl">{d.heroLead}</p>

        <blockquote className="float-soft mt-12 max-w-xl rounded-[2rem] border border-butter/80 bg-paper/80 px-8 py-7 shadow-[0_20px_60px_rgba(47,43,40,0.08)] backdrop-blur-sm">
          <span className="candle mx-auto mb-3 block h-2 w-2 rounded-full bg-butter" />
          <p className="font-display text-2xl italic leading-snug sm:text-3xl">« {d.quote} »</p>
          <footer className="mt-4 font-display text-sm tracking-[0.2em] text-ink/50">
            — {d.quoteAuthor}
          </footer>
        </blockquote>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="#honneur"
            className="rounded-full bg-ink px-6 py-2.5 font-display text-paper hover:bg-ink/85"
          >
            {d.featured}
          </Link>
          <Link
            href="/salon"
            className="rounded-full border border-ink/20 bg-paper/70 px-6 py-2.5 font-display hover:bg-paper"
          >
            {d.navSalon}
          </Link>
        </div>
      </div>
    </section>
  );
}
