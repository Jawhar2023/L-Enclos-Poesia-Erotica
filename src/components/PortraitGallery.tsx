"use client";

import { ninonPortraits } from "@/data/portraits";
import { useLang } from "@/context/LangContext";

export function PortraitGallery() {
  const { lang, d } = useLang();
  const strip = [...ninonPortraits, ...ninonPortraits];

  return (
    <section className="overflow-hidden py-20">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.4em] text-ink/45">XVIIᵉ</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl">{d.gallery}</h2>
        <div className="gold-rule mx-auto mt-5 h-px w-40" />
      </div>
      <div className="mt-12 overflow-hidden">
        <div className="portrait-track flex gap-10 pe-10">
          {strip.map((p, i) => (
            <figure key={`${p.src}-${i}`} className="w-[340px] shrink-0 sm:w-[400px] lg:w-[460px]">
              <div className="cameo-frame overflow-hidden bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={lang === "ar" ? p.altAr : p.altFr}
                  className="aspect-[3/4] w-full object-cover object-top"
                />
              </div>
              <figcaption className="mt-5 px-3 text-center font-display text-base text-ink/60">
                {lang === "ar" ? p.altAr : p.altFr}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
