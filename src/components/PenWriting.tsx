"use client";

import { useEffect, useState } from "react";

function PenNib({ rtl }: { rtl: boolean }) {
  return (
    <span
      className={`pen-hand inline-block align-[-0.75em] ${rtl ? "-scale-x-100" : ""}`}
      aria-hidden
    >
      <svg viewBox="0 0 52 52" className="pen-nib h-9 w-9 sm:h-10 sm:w-10">
        <path d="M16 36c9-11 18-22 31-31-5 11-13 20-22 27l-9 4Z" fill="#1f1c1a" />
        <path d="M18 34c4-5 10-11 16-16" stroke="#d4b56a" strokeWidth="1.3" fill="none" />
        <path d="M14 38 8 48" stroke="#3d3a38" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8.5" cy="48" r="2" className="pen-ink" fill="#2f2b28" />
      </svg>
    </span>
  );
}

export function PenWriting({
  text,
  className = "",
  rtl = false,
}: {
  text: string;
  className?: string;
  rtl?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!text) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }

    const delay = text.length > 80 ? 16 : 18;
    const step = Math.max(1, Math.ceil(text.length / 48));
    let i = 0;
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i = Math.min(text.length, i + step);
        setCount(i);
        if (i >= text.length) window.clearInterval(interval);
      }, delay);
    }, 80);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [text]);

  const written = text.slice(0, count);
  const writing = count < text.length;

  return (
    <div
      className={`relative ${className}`}
      dir={rtl ? "rtl" : "ltr"}
      aria-label={text}
    >
      <div className="invisible whitespace-pre-wrap" aria-hidden>
        {text}
      </div>
      <div className="absolute inset-0 overflow-visible whitespace-pre-wrap" aria-hidden>
        {written}
        {writing ? <PenNib rtl={rtl} /> : null}
      </div>
    </div>
  );
}
