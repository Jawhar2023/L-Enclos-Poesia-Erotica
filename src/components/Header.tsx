"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GateMark } from "@/components/GateMark";
import { LangSwitch } from "@/components/LangSwitch";
import { useLang } from "@/context/LangContext";

export function Header() {
  const { d, lang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    ["/", d.navHome],
    ["/salon", d.navSalon],
    ["/poete", d.navPoet],
    ["/poemes", d.navPoems],
    ["/soumettre", d.navSubmit],
    ["/contact", d.navContact],
  ] as const;
  const linkFont = lang === "ar" ? "font-poem-ar" : "font-display";

  return (
    <header className="sticky top-0 z-40 border-b border-mist/70 bg-cream/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4 lg:px-10 lg:py-5">
        <Link href="/" className="flex min-w-0 items-center gap-3.5">
          <GateMark className="h-10 w-10 shrink-0" />
          <span className="min-w-0">
            <p
              className={`${linkFont} text-[11px] uppercase leading-none tracking-[0.28em] text-ink/45`}
            >
              {d.siteTag}
            </p>
            <h1
              className={`${linkFont} mt-1.5 truncate text-[1.35rem] font-medium leading-none tracking-tight sm:text-[1.5rem]`}
            >
              {d.siteName}
            </h1>
          </span>
        </Link>
        <nav className="hidden items-center lg:flex">
          {links.map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`${linkFont} mx-1.5 px-2.5 py-1 text-[1.125rem] font-medium leading-none tracking-[0.03em] transition ${
                  active ? "text-ink" : "text-ink/58 hover:text-ink"
                }`}
              >
                <span className={`nav-label ${active ? "is-active" : ""}`}>{label}</span>
              </Link>
            );
          })}
          <span className="mx-3 h-5 w-px bg-ink/12" aria-hidden />
          <AdminIconLink label={d.navAdmin} />
          <span className="ms-3">
            <LangSwitch />
          </span>
        </nav>
        <div className="flex items-center gap-3 lg:hidden">
          <AdminIconLink label={d.navAdmin} />
          <LangSwitch />
          <button
            type="button"
            className="rounded-full border border-ink/15 bg-paper/80 px-3.5 py-1.5 text-base"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>
      {open ? (
        <div className="grid gap-1 border-t border-mist px-6 py-4 lg:hidden">
          {links.map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`${linkFont} rounded-xl px-2 py-2.5 text-[1.25rem] font-medium ${
                  active ? "bg-paper/80 text-ink" : "text-ink/70"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className={`${linkFont} mt-1 flex items-center gap-2 rounded-xl px-2 py-2.5 text-[1.25rem] font-medium text-ink/70`}
          >
            <AdminGlyph />
            {d.navAdmin}
          </Link>
        </div>
      ) : null}
    </header>
  );
}

function AdminGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none">
      <rect x="4" y="8" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 8V6.5A4 4 0 0 1 16 6.5V8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="14" r="1.3" fill="currentColor" />
    </svg>
  );
}

function AdminIconLink({ label }: { label: string }) {
  return (
    <Link
      href="/admin"
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-paper/80 text-ink/70 transition hover:border-ink/30 hover:text-ink"
    >
      <AdminGlyph />
    </Link>
  );
}
