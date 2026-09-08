"use client";

import Link from "next/link";
import { GateMark } from "@/components/GateMark";
import { useLang } from "@/context/LangContext";

export function Footer() {
  const { d } = useLang();
  return (
    <footer className="mt-auto border-t border-mist/80 bg-paper/50">
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <GateMark className="mx-auto h-10 w-10" />
        <p className="mt-4 font-display text-2xl">{d.siteName}</p>
        <p className="mt-1 text-sm tracking-[0.2em] text-ink/50">{d.siteTag}</p>
        <div className="mt-5 flex justify-center gap-6 font-display">
          <Link href="/contact">{d.navContact}</Link>
          <Link href="/admin">{d.navAdmin}</Link>
        </div>
      </div>
    </footer>
  );
}
