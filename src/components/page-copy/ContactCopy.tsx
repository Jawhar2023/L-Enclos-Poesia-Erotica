"use client";

import { GateMark } from "@/components/GateMark";
import { useLang } from "@/context/LangContext";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden fill="none">
      <path
        d="M14 10h4l1.5 6-2.5 1.5c1.4 2.8 3.7 5 6.5 6.5L25 21.5l6 1.5v4c0 1.4-1.2 2.6-2.6 2.4C17 28 12 18.6 12.6 12.4 12.8 11.1 13.8 10 14 10Z"
        stroke="#3d3a38"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden fill="none">
      <path
        d="M10 14c0-3 3-6 10-6s10 3 10 6-3 7-10 7c-1.4 0-2.6-.1-3.8-.4L10 24v-10Z"
        stroke="#3d3a38"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M16 14.5h.01M20 14.5h.01M24 14.5h.01" stroke="#3d3a38" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LetterIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden fill="none">
      <rect x="8" y="12" width="24" height="16" rx="1.5" stroke="#3d3a38" strokeWidth="1.4" />
      <path d="m8 13 12 8 12-8" stroke="#3d3a38" strokeWidth="1.4" />
    </svg>
  );
}

export function ContactCopy() {
  const { d } = useLang();

  return (
    <div className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/portraits/ninon-mignard.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-[520px] w-full object-cover object-top opacity-20"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/50 via-cream/85 to-cream" />
      <div className="pointer-events-none absolute -left-16 top-32 h-64 w-64 rounded-full bg-sky/35 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-rose/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="text-center lg:text-start">
            <div className="mx-auto w-fit lg:mx-0">
              <div className="cameo-frame mx-auto overflow-hidden lg:mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/portraits/abdelhamid-ladhari.jpg"
                  alt="Abdelhamid Ladhari"
                  className="mx-auto aspect-[4/5] w-56 object-cover object-[50%_18%] sm:w-72"
                />
              </div>
            </div>
            <p className="mt-8 font-display text-[11px] uppercase tracking-[0.38em] text-ink/50">
              {d.contactKicker}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl">{d.contactTitle}</h1>
            <div className="gold-rule mx-auto my-6 h-px w-28 lg:mx-0" />
            <p className="mx-auto max-w-md text-lg leading-8 text-ink/70 lg:mx-0">{d.contactLead}</p>
          </div>

          <div className="alcove relative rounded-[2rem] p-5 sm:p-8">
            <div className="absolute -top-4 end-8 flex h-14 w-14 items-center justify-center rounded-full bg-butter shadow-md">
              <GateMark className="h-7 w-7" />
            </div>
            <p className="max-w-lg font-display text-xl italic leading-8 text-ink/75">« {d.quote} »</p>
            <p className="mt-3 font-display text-sm tracking-[0.18em] text-ink/45">— {d.quoteAuthor}</p>
            <p className="mt-6 leading-7 text-ink/70">{d.contactNote}</p>

            <div className="mt-8 grid gap-4">
              <a
                href="tel:+21698578939"
                className="group flex items-center gap-4 rounded-[1.4rem] bg-gradient-to-br from-pistachio/70 to-paper p-4 shadow-sm transition hover:-translate-y-0.5 sm:p-5"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper">
                  <PhoneIcon />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xs uppercase tracking-[0.28em] text-ink/45">
                    {d.phone} · {d.phoneHint}
                  </span>
                  <span className="mt-1 block font-display text-2xl sm:text-3xl" dir="ltr">
                    +216 98 578 939
                  </span>
                  <span className="mt-1 block text-sm text-ink/55 underline decoration-ink/20 underline-offset-4 group-hover:text-ink">
                    {d.phoneAction}
                  </span>
                </span>
              </a>

              <a
                href="https://wa.me/21698578939"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[1.4rem] bg-gradient-to-br from-sky/60 to-paper p-4 shadow-sm transition hover:-translate-y-0.5 sm:p-5"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper">
                  <ChatIcon />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xs uppercase tracking-[0.28em] text-ink/45">
                    {d.whatsapp}
                  </span>
                  <span className="mt-1 block font-display text-2xl">{d.whatsappAction}</span>
                  <span className="mt-1 block text-sm text-ink/55" dir="ltr">
                    +216 98 578 939
                  </span>
                </span>
              </a>

              <a
                href="https://www.facebook.com/abdelhamid.ladhari"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[1.4rem] bg-gradient-to-br from-rose/55 to-paper p-4 shadow-sm transition hover:-translate-y-0.5 sm:p-5"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper">
                  <LetterIcon />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xs uppercase tracking-[0.28em] text-ink/45">
                    {d.facebook}
                  </span>
                  <span className="mt-1 block font-display text-2xl">{d.facebookAction}</span>
                  <span className="mt-1 block text-sm text-ink/55">{d.facebookHint}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
