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

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden fill="none">
      <rect x="8" y="12" width="24" height="16" rx="1.5" stroke="#3d3a38" strokeWidth="1.4" />
      <path d="m8 13 12 8 12-8" stroke="#3d3a38" strokeWidth="1.4" />
    </svg>
  );
}

function LetterIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden fill="none">
      <path
        d="M20 10C14.5 10 10 14.5 10 20s4.5 10 10 10 10-4.5 10-10S25.5 10 20 10Z"
        stroke="#3d3a38"
        strokeWidth="1.4"
      />
      <path d="M18 24v-8h4a2 2 0 0 1 0 4h-4" stroke="#3d3a38" strokeWidth="1.4" />
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
            <p className="mt-8 font-display text-sm font-bold uppercase tracking-[0.25em] text-black">
              {d.contactKicker}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-6xl text-black">{d.contactTitle}</h1>
            <div className="gold-rule mx-auto my-6 h-0.5 w-32 bg-black/40 lg:mx-0" />
            <p className="mx-auto max-w-md text-xl font-medium leading-9 text-black lg:mx-0">{d.contactLead}</p>
          </div>

          <div className="alcove relative rounded-[2rem] border-2 border-black/15 p-6 sm:p-9 shadow-sm">
            <div className="absolute -top-4 end-8 flex h-14 w-14 items-center justify-center rounded-full bg-butter shadow-md border-2 border-black/20">
              <GateMark className="h-7 w-7" />
            </div>
            <p className="max-w-lg font-display text-2xl font-bold italic leading-9 text-black">« {d.quote} »</p>
            <p className="mt-3 font-display text-base font-bold tracking-[0.18em] text-black/85">— {d.quoteAuthor}</p>
            <p className="mt-6 text-lg font-medium leading-8 text-black">{d.contactNote}</p>

            <div className="mt-8 grid gap-4">
              <a
                href="mailto:abdelhamidhari54@gmail.com"
                className="group flex items-center gap-4 rounded-[1.4rem] border-2 border-black/15 bg-gradient-to-br from-butter to-paper p-4 shadow-sm transition hover:-translate-y-0.5 sm:p-5"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper border border-black/20">
                  <EnvelopeIcon />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-bold uppercase tracking-[0.2em] text-black">
                    {d.email}
                  </span>
                  <span className="mt-1 block font-display text-xl sm:text-2xl font-bold text-black truncate" dir="ltr">
                    abdelhamidhari54@gmail.com
                  </span>
                  <span className="mt-1 block text-base font-bold text-black underline decoration-black/40 underline-offset-4 group-hover:decoration-black">
                    {d.emailAction}
                  </span>
                </span>
              </a>

              <a
                href="tel:+21698578939"
                className="group flex items-center gap-4 rounded-[1.4rem] border-2 border-black/15 bg-gradient-to-br from-pistachio to-paper p-4 shadow-sm transition hover:-translate-y-0.5 sm:p-5"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper border border-black/20">
                  <PhoneIcon />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-bold uppercase tracking-[0.2em] text-black">
                    {d.phone} · {d.phoneHint}
                  </span>
                  <span className="mt-1 block font-display text-2xl sm:text-3xl font-bold text-black" dir="ltr">
                    +216 98 578 939
                  </span>
                  <span className="mt-1 block text-base font-bold text-black underline decoration-black/40 underline-offset-4 group-hover:decoration-black">
                    {d.phoneAction}
                  </span>
                </span>
              </a>

              <a
                href="https://wa.me/21698578939"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[1.4rem] border-2 border-black/15 bg-gradient-to-br from-sky to-paper p-4 shadow-sm transition hover:-translate-y-0.5 sm:p-5"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper border border-black/20">
                  <ChatIcon />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-bold uppercase tracking-[0.2em] text-black">
                    {d.whatsapp}
                  </span>
                  <span className="mt-1 block font-display text-2xl font-bold text-black">{d.whatsappAction}</span>
                  <span className="mt-1 block text-base font-bold text-black" dir="ltr">
                    +216 98 578 939
                  </span>
                </span>
              </a>

              <a
                href="https://www.facebook.com/abdelhamid.ladhari"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[1.4rem] border-2 border-black/15 bg-gradient-to-br from-rose to-paper p-4 shadow-sm transition hover:-translate-y-0.5 sm:p-5"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper border border-black/20">
                  <LetterIcon />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-bold uppercase tracking-[0.2em] text-black">
                    {d.facebook}
                  </span>
                  <span className="mt-1 block font-display text-2xl font-bold text-black">{d.facebookAction}</span>
                  <span className="mt-1 block text-base font-bold text-black">{d.facebookHint}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
