"use client";

import { Ornament } from "@/components/Ornament";
import { useLang } from "@/context/LangContext";

export function SalonCopy() {
  const { lang } = useLang();
  const fr = lang === "fr";

  return (
    <article>
      <p className="font-display text-xs uppercase tracking-[0.3em] text-ink/50">
        {fr ? "1620 — 1705" : "١٦٢٠ — ١٧٠٥"}
      </p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">
        {fr ? "Le salon d'Anne de Lenclos" : "صالون آن دو لنكلو"}
      </h1>
      <Ornament className="my-6 justify-start" />
      <div className="space-y-5 text-lg leading-8 text-ink/80">
        <p>
          {fr
            ? "Anne, dite Ninon de Lenclos (ou de l'Enclos), baptisée à Paris le 10 novembre 1620 et morte le 17 octobre 1705, fut courtisane, femme d'esprit, épistolière et femme de lettres. Aristocrate cultivée et indépendante, elle anima un salon rue des Tournelles qui réunissait les grands esprits de son siècle."
            : "آن، الملقّبة نينون دو لنكلو، عُمّدت في باريس في 10 نوفمبر 1620 وتوفيت في 17 أكتوبر 1705. كانت سيدة صالون، كاتبة رسائل، وامرأة أدب حرّة. أرستقراطية مثقفة مستقلة، أدارت صالوناً في شارع تورنيل جمع كبار عقول عصرها."}
        </p>
        <p>
          {fr
            ? "À compter de 1667, au 36, rue des Tournelles, ses célèbres « cinq à neuf » avaient lieu chaque jour. On y croisait Molière, Racine, La Fontaine, Saint-Évremond, et plus tard le jeune Voltaire, à qui elle laissa de l'argent pour acheter des livres."
            : "منذ 1667، في 36 شارع تورنيل، كانت «الخمس إلى التسع» الشهيرة تُعقد كل يوم. مرّ منها موليير وراسين ولافونتين وسانت إيفرمون، ثم الشاب فولتير الذي أوصت له بمال ليشتري كتباً."}
        </p>
        <p>
          {fr
            ? "L'Enclos reprend ce geste : un jardin clos où la poésie amoureuse et érotique se lit sans fausse pudeur, dans la lumière pastel d'un salon."
            : "يستعيد الإنكلوس هذه الإشارة: حديقة مغلقة تُقرأ فيها قصيدة العشق والجسد بلا رياء، في ضوء صالون باستيل."}
        </p>
      </div>
    </article>
  );
}
