"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LangContext";

type Phase = "idle" | "turn";

function isInternalNav(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  return url;
}

export function BookTurn() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useLang();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<string | null>(null);
  const prevPath = useRef(pathname);
  const busy = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (busy.current || phase !== "idle") return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (document.querySelector(".intro-root")) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = isInternalNav(anchor);
      if (!url) return;

      const next = `${url.pathname}${url.search}`;
      const here = `${window.location.pathname}${window.location.search}`;
      if (next === here) return;

      event.preventDefault();
      event.stopPropagation();
      busy.current = true;
      pending.current = `${next}${url.hash}`;
      setPhase("turn");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [phase]);

  useEffect(() => {
    if (phase !== "turn") return;
    const href = pending.current;
    const go = window.setTimeout(() => {
      if (href) router.push(href);
    }, 220);
    const done = window.setTimeout(() => {
      busy.current = false;
      pending.current = null;
      setPhase("idle");
    }, 980);
    return () => {
      window.clearTimeout(go);
      window.clearTimeout(done);
    };
  }, [phase, router]);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    if (pending.current) {
      pending.current = null;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busy.current = true;
    setPhase("turn");
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div className={`folio-turn ${lang === "ar" ? "is-rtl" : ""}`} aria-hidden>
      <div className="folio-leaf">
        <span className="folio-vein" />
        <span className="folio-blush" />
      </div>
      <div className="folio-curl" />
    </div>
  );
}
