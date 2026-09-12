"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GateMark } from "@/components/GateMark";
import { LangSwitch } from "@/components/LangSwitch";
import { useLang } from "@/context/LangContext";

export function Header() {
  const { d, lang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        <Link href="/" onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3.5">
          <GateMark className="h-10 w-10 shrink-0" />
          <span className="min-w-0">
            <p
              className={`${linkFont} text-xs uppercase font-semibold leading-none tracking-[0.25em] text-black/80`}
            >
              {d.siteTag}
            </p>
            <h1
              className={`${linkFont} mt-1.5 truncate text-[1.45rem] font-bold leading-none tracking-tight sm:text-[1.65rem] text-black`}
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
                className={`${linkFont} mx-2 px-3 py-1.5 text-[1.35rem] sm:text-[1.45rem] font-bold leading-none tracking-[0.02em] transition-all duration-200 ${
                  active
                    ? "text-black font-extrabold scale-[1.08]"
                    : "text-black/90 hover:text-black hover:scale-[1.05]"
                }`}
              >
                <span className={`nav-label ${active ? "is-active" : ""}`}>{label}</span>
              </Link>
            );
          })}
          <span className="mx-3 h-5 w-px bg-black/20" aria-hidden />
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
            className="rounded-full border border-black/30 bg-paper px-3.5 py-1.5 text-base font-bold text-black"
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
                className={`${linkFont} rounded-xl px-2 py-2.5 text-[1.35rem] font-bold ${
                  active ? "bg-paper text-black" : "text-black/85 hover:text-black"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className={`${linkFont} mt-1 flex items-center gap-2 rounded-xl px-2 py-2.5 text-[1.35rem] font-bold text-black`}
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
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" aria-hidden fill="none">
      <rect x="4" y="8" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8V6.5A4 4 0 0 1 16 6.5V8" stroke="currentColor" strokeWidth="1.6" />
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/25 bg-paper text-black transition hover:border-black hover:scale-105"
    >
      <AdminGlyph />
    </Link>
  );
}
