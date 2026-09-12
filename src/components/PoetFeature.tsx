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
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-black">
              {d.poetSection}
            </p>
            <h2 className="mt-3 font-display text-5xl font-bold leading-tight sm:text-6xl text-black">{d.poetName}</h2>
            <div className="gold-rule my-6 h-0.5 w-32 bg-black/40" />
            <p className="max-w-xl text-xl font-medium leading-9 text-black">{d.poetLead}</p>
            <Link
              href="/poete"
              className="mt-8 inline-flex rounded-full border-2 border-black bg-butter px-7 py-3 font-display text-lg font-bold text-black hover:bg-butter/80 transition"
            >
              {d.poetMore}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
