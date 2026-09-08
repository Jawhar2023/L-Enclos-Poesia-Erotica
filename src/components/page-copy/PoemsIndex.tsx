"use client";

import { Ornament } from "@/components/Ornament";
import { PenWriting } from "@/components/PenWriting";
import { PoemCard } from "@/components/PoemCard";
import { useLang } from "@/context/LangContext";
import type { Poem } from "@/types";

export function PoemsIndex({ poems }: { poems: Poem[] }) {
  const { d, lang } = useLang();
  return (
    <div>
      <h1 className="mx-auto max-w-3xl text-center font-display text-4xl sm:text-5xl">
        <PenWriting
          text={d.poemsTitle}
          rtl={lang === "ar"}
          className="font-display text-4xl sm:text-5xl"
        />
      </h1>
      <Ornament className="my-6" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {poems.map((poem) => (
          <PoemCard key={poem.id} poem={poem} />
        ))}
      </div>
    </div>
  );
}
