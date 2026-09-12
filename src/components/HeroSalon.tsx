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
        <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.3em] text-black">
          {d.heroKicker}
        </p>
        <h2 className="mt-5 font-display text-5xl font-bold leading-[0.95] sm:text-7xl md:text-8xl text-black">
          {d.siteName}
        </h2>
        <p className="mt-6 max-w-2xl text-xl font-medium leading-9 text-black sm:text-2xl">{d.heroLead}</p>

        <blockquote className="float-soft mt-12 max-w-xl rounded-[2rem] border-2 border-black/15 bg-paper px-8 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-sm">
          <span className="candle mx-auto mb-3 block h-2.5 w-2.5 rounded-full bg-black/80" />
          <p className="font-display text-2xl font-bold italic leading-snug sm:text-3xl text-black">« {d.quote} »</p>
          <footer className="mt-4 font-display text-base font-semibold tracking-[0.2em] text-black/80">
            — {d.quoteAuthor}
          </footer>
        </blockquote>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="#honneur"
            className="rounded-full bg-black px-7 py-3 font-display text-xl font-bold text-paper hover:bg-black/85 transition"
          >
            {d.featured}
          </Link>
          <Link
            href="/salon"
            className="rounded-full border-2 border-black bg-paper px-7 py-3 font-display text-xl font-bold text-black hover:bg-cream transition"
          >
            {d.navSalon}
          </Link>
        </div>
      </div>
    </section>
  );
}
