"use client";

import Link from "next/link";
import { Ornament } from "@/components/Ornament";
import { useLang } from "@/context/LangContext";

export function HomeCopy({ variant = "hero" }: { variant?: "hero" | "poet" | "featured" | "all" }) {
  const { d } = useLang();

  if (variant === "poet") {
    return (
      <div>
        <p className="font-display text-xs uppercase tracking-[0.28em] text-ink/50">
          {d.poetSection}
        </p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl">{d.poetName}</h2>
        <Ornament className="my-4 justify-start" />
        <p className="max-w-xl text-lg leading-8 text-ink/75">{d.poetLead}</p>
        <Link
          href="/poete"
          className="mt-6 inline-flex rounded-full bg-butter px-5 py-2 font-display hover:bg-butter/80"
        >
          {d.poetMore}
        </Link>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl">{d.featured}</h2>
        <div className="ornament-line mx-auto mt-4 max-w-sm" />
      </div>
    );
  }

  if (variant === "all") {
    return (
      <div className="mt-8 text-center">
        <Link
          href="/poemes"
          className="inline-flex rounded-full border border-pistachio bg-pistachio/40 px-6 py-2 font-display hover:bg-pistachio"
        >
          {d.allPoems}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <p className="font-display text-sm uppercase tracking-[0.35em] text-ink/50">
        {d.heroKicker}
      </p>
      <h2 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">{d.siteName}</h2>
      <Ornament className="my-6" />
      <p className="text-lg leading-8 text-ink/75 sm:text-xl">{d.heroLead}</p>
      <blockquote className="mx-auto mt-10 max-w-xl rounded-[1.5rem] bg-paper/80 px-6 py-6 shadow-sm">
        <p className="font-display text-2xl italic leading-snug">« {d.quote} »</p>
        <footer className="mt-3 text-sm text-ink/55">— {d.quoteAuthor}</footer>
      </blockquote>
    </div>
  );
}
