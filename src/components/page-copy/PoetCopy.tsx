"use client";

import { Ornament } from "@/components/Ornament";
import { useLang } from "@/context/LangContext";

const worksFr = [
  "Mouvement littéraire et intellectuel en Tunisie — Fadhel Ben Achour",
  "Adieu Rosalie — Hassouna Mosbahi (2001)",
  "Promosport — Hassen Ben Othmane (2008)",
  "Tujan — Emna Rmili, Institut de Traduction de Tunis",
  "Fou de toi — Béchir Khraïef",
  "Dīwān de Mohamed Ghozzi — Éditions Nirvana, préface de Moncef Ouhaïbi",
];

const worksAr = [
  "الحركة الأدبية والفكرية في تونس — الفاضل بن عاشور",
  "وداعاً روزالي — حسونة المصباحي (2001)",
  "بروموسبور — حسن بن عثمان (2008)",
  "توجان — آمنة الرميلي، معهد تونس للترجمة",
  "مجنون بك — البشير خريف",
  "ديوان محمد الغزّي — دار نيرفانا، تقديم المنصف الوهايبي",
];

export function PoetCopy() {
  const { lang, d } = useLang();
  const fr = lang === "fr";

  return (
    <article className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="overflow-hidden rounded-[2rem] bg-paper p-3 shadow-[0_18px_50px_rgba(61,58,56,0.1)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/portraits/abdelhamid-ladhari.jpg"
          alt="Abdelhamid Ladhari"
          className="w-full rounded-[1.6rem] object-cover"
        />
      </div>
      <div>
        <p className="font-display text-xs uppercase tracking-[0.28em] text-ink/50">
          {d.poetSection}
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{d.poetTitle}</h1>
        <Ornament className="my-5 justify-start" />
        <p className="text-lg leading-8 text-ink/80">
          {fr
            ? "Universitaire tunisien, professeur, spécialiste de stylistique et de poésie. Il a enseigné à la Faculté des lettres de Kairouan dès les années 1980, aux côtés de Mohamed Ghozzi. Ses études remontent aux années 1970 — il évoque encore son maître Abdeljalil Karoui."
            : "جامعي تونسي، أستاذ، متخصص في الأسلوبية والشعر. درّس في كلية الآداب بالقيروان منذ الثمانينيات إلى جانب محمد الغزّي. تعود دراسته إلى سبعينيات القرن العشرين، وهو يذكر أستاذه عبد الجليل القروي."}
        </p>
        <dl className="mt-6 rounded-2xl bg-cream px-5 py-4">
          <dt className="font-display text-sm uppercase tracking-widest text-ink/50">{d.birth}</dt>
          <dd className="mt-1">{d.birthValue}</dd>
        </dl>
        <h2 className="mt-8 font-display text-2xl">{d.career}</h2>
        <p className="mt-3 leading-8 text-ink/80">
          {fr
            ? "Traducteur littéraire arabe ↔ français, il défend la traduction comme transcréation : « fidélité totale à l'esprit, relative à la lettre », dans le sillage d'Umberto Eco. Un poème, dit-il, doit être traduit par un texte poétique. Finaliste du Prix Ibn Khaldoun–Senghor 2025 pour Tujan d'Emna Rmili."
            : "مترجم أدبي بين العربية والفرنسية، يرى الترجمة إعادة خلق: وفاء تامّ للروح ونسبيّ للحرف، على نهج أمبرتو إيكو. القصيدة تُترجم بنصّ شعري. كان من المتأهلين لجائزة ابن خلدون-سنغور 2025 عن رواية توجان لآمنة الرميلي."}
        </p>
        <h2 className="mt-8 font-display text-2xl">{d.works}</h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-ink/80">
          {(fr ? worksFr : worksAr).map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
