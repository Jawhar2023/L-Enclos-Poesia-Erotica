"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";

export function PoetFeature() {
  const { d } = useLang();

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-10">
      <div className="alcove overflow-hidden rounded-[2.2rem] p-4 sm:p-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-md">
            <div className="cameo-frame overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portraits/abdelhamid-ladhari.jpg"
                alt="Abdelhamid Ladhari"
                className="aspect-[4/5] w-full object-cover object-[50%_18%]"
              />
            </div>
            <div className="absolute -bottom-4 -end-2 hidden w-28 overflow-hidden rounded-full border-4 border-paper shadow-xl sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portraits/ninon-mignard.jpg" alt="" className="aspect-square object-cover" />
            </div>
          </div>
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.35em] text-ink/45">
              {d.poetSection}
            </p>
            <h2 className="mt-3 font-display text-5xl leading-tight sm:text-6xl">{d.poetName}</h2>
            <div className="gold-rule my-6 h-px w-28" />
            <p className="max-w-xl text-lg leading-8 text-ink/75">{d.poetLead}</p>
            <Link
              href="/poete"
              className="mt-8 inline-flex rounded-full bg-butter px-6 py-2.5 font-display hover:bg-butter/80"
            >
              {d.poetMore}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
