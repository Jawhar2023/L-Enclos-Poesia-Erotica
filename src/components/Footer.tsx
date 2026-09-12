"use client";

import Link from "next/link";
import { GateMark } from "@/components/GateMark";
import { useLang } from "@/context/LangContext";

export function Footer() {
  const { d } = useLang();
  return (
    <footer className="mt-auto border-t border-black/15 bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <GateMark className="mx-auto h-12 w-12" />
        <p className="mt-4 font-display text-3xl font-bold text-black">{d.siteName}</p>
        <p className="mt-1 text-base font-semibold tracking-[0.2em] text-black/85">{d.siteTag}</p>
        <div className="mt-6 flex justify-center gap-8 font-display text-lg font-bold text-black">
          <Link href="/contact" className="hover:underline underline-offset-4">{d.navContact}</Link>
          <Link href="/admin" className="hover:underline underline-offset-4">{d.navAdmin}</Link>
        </div>
      </div>
    </footer>
  );
}
