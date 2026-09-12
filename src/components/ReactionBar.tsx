"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/context/LangContext";

export function ReactionBar({ poemId }: { poemId: string }) {
  const { d } = useLang();
  const [count, setCount] = useState(0);
  const [mine, setMine] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/reactions?poemId=${encodeURIComponent(poemId)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setCount(data.count ?? 0);
        setMine(Boolean(data.mine));
      })
      .catch(() => undefined);
  }, [poemId]);

  async function toggle() {
    if (busy) return;
    const nextMine = !mine;
    setMine(nextMine);
    setCount((n) => Math.max(0, n + (nextMine ? 1 : -1)));
    setBusy(true);
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ poemId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMine(!nextMine);
        setCount((n) => Math.max(0, n + (nextMine ? -1 : 1)));
        return;
      }
      setCount(data.count ?? 0);
      setMine(Boolean(data.mine));
    } catch {
      setMine(!nextMine);
      setCount((n) => Math.max(0, n + (nextMine ? -1 : 1)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`rounded-full border-2 px-5 py-2.5 font-display text-base font-bold transition disabled:opacity-60 ${
          mine
            ? "border-black bg-rose text-black shadow-sm scale-105"
            : "border-black/30 bg-paper text-black hover:border-black hover:bg-rose/40"
        }`}
      >
        ♥ {d.heart}
      </button>
      <span className="text-lg font-bold text-black">{count}</span>
    </div>
  );
}