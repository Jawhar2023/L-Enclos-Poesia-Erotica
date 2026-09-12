"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LangContext";

const PHONE = "+21698578939";
const FACEBOOK = "https://www.facebook.com/abdelhamid.ladhari";
const WHATSAPP = "https://wa.me/21698578939";

export function ContactDock() {
  const { d } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="pointer-events-none fixed right-4 bottom-5 z-50 sm:right-6">
      {open ? (
        <button
          type="button"
          className="pointer-events-auto fixed inset-0 z-40 cursor-default bg-transparent"
          aria-label={d.adminCancel}
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="pointer-events-auto relative z-50 flex flex-col items-center gap-3">
        {open ? (
          <>
            <a
              href="mailto:abdelhamidhari54@gmail.com"
              aria-label={d.email}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-black bg-[#EAB308] text-black shadow-[0_6px_16px_rgba(234,179,8,0.45)] transition hover:scale-105"
            >
              <EnvelopeGlyph />
            </a>
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noreferrer"
              aria-label={d.facebook}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-[0_6px_16px_rgba(24,119,242,0.45)] transition hover:scale-105"
            >
              <FacebookGlyph />
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              aria-label={d.whatsapp}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-black bg-[#25D366] text-white shadow-[0_6px_16px_rgba(37,211,102,0.45)] transition hover:scale-105"
            >
              <WhatsAppGlyph />
            </a>
            <a
              href={`tel:${PHONE}`}
              aria-label={d.phoneAction}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1b3a4b] text-white shadow-[0_6px_16px_rgba(27,58,75,0.4)] transition hover:scale-105"
            >
              <PhoneGlyph />
            </a>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={d.phone}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-black bg-[#2aa8a1] text-white shadow-[0_8px_20px_rgba(42,168,161,0.55)] transition hover:scale-105"
        >
          {open ? <CloseGlyph /> : <PhoneGlyph />}
        </button>
      </div>
    </div>
  );
}

function EnvelopeGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none">
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none">
      <path
        d="M6.8 3.6h2.8l1.2 4.2-1.9 1.1c1 2 2.7 3.7 4.8 4.8l1.1-1.9 4.2 1.2v2.7c0 1-.9 1.8-1.9 1.7C9 16.9 5.2 10.1 5.6 5.5c.1-1 .9-1.9 1.2-1.9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden fill="currentColor">
      <path d="M14.4 21v-7.3h2.5l.4-2.9h-2.9V8.9c0-.8.2-1.4 1.5-1.4H16V5.2c-.3 0-1.3-.1-2.4-.1-2.3 0-3.9 1.4-3.9 4v2.1H7.6v2.9h2.1V21h4.7Z" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden fill="currentColor">
      <path d="M12.04 4.1A7.84 7.84 0 0 0 4.2 11.9c0 1.38.36 2.72 1.05 3.9L4 20l4.3-1.13a7.84 7.84 0 0 0 3.74.94h.01A7.84 7.84 0 0 0 19.9 11.9 7.84 7.84 0 0 0 12.04 4.1Zm0 14.32h-.01a6.5 6.5 0 0 1-3.31-.9l-.24-.14-2.55.67.68-2.48-.15-.26a6.5 6.5 0 0 1-1-3.41 6.52 6.52 0 0 1 11.11-4.61 6.52 6.52 0 0 1-4.53 11.13Zm3.57-4.87c-.2-.1-1.16-.57-1.34-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.83-.3-1.58-.97-.58-.52-.98-1.16-1.09-1.35-.12-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.11.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.33h-.37c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.66s.72 1.93.82 2.06c.1.13 1.41 2.15 3.42 3.02.48.2.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.16-.47 1.33-.93.16-.46.16-.85.11-.93-.05-.08-.18-.13-.37-.23Z" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none">
      <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
