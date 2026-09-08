"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LangContext";

export function ReactionBar({ poemId }: { poemId: string }) {
  const { d } = useLang();
  const [count, setCount] = useState(0);
  const [mine, setMine] = useState(false);

  useEffect(() => {
    fetch(`/api/reactions?poemId=${encodeURIComponent(poemId)}`)
      .then((r) => r.json())
      .then((data) => {
        setCount(data.count ?? 0);
        setMine(Boolean(data.mine));
      })
      .catch(() => undefined);
  }, [poemId]);

  async function toggle() {
    const res = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poemId }),
    });
    const data = await res.json();
    setCount(data.count ?? 0);
    setMine(Boolean(data.mine));
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        className={`rounded-full border px-4 py-2 font-display text-sm transition ${
          mine
            ? "border-rose bg-rose/70 text-ink"
            : "border-rose/50 bg-paper hover:bg-rose/30"
        }`}
      >
        ♥ {d.heart}
      </button>
      <span className="text-sm text-ink/60">{count}</span>
    </div>
  );
}
