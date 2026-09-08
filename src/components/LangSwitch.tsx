"use client";

import { useLang } from "@/context/LangContext";

export function LangSwitch() {
  const { lang, setLang } = useLang();

  return (
    <div
      className="flex items-center rounded-full border border-sky/70 bg-paper/80 p-1 shadow-sm"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={`min-w-10 rounded-full px-3 py-1 font-display text-sm tracking-wide transition ${
          lang === "fr" ? "bg-sky text-ink shadow" : "text-ink/60 hover:text-ink"
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`min-w-10 rounded-full px-3 py-1 font-poem-ar text-sm transition ${
          lang === "ar" ? "bg-rose text-ink shadow" : "text-ink/60 hover:text-ink"
        }`}
      >
        AR
      </button>
    </div>
  );
}
