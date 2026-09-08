import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cormorant_Garamond, Noto_Naskh_Arabic, Source_Sans_3 } from "next/font/google";
import { BookTurn } from "@/components/BookTurn";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LangProvider } from "@/context/LangContext";
import type { Lang } from "@/types";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-naskh",
});

const source = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: "L'Enclos Poesia Erotica",
  description:
    "Salon littéraire dédié à la poésie amoureuse et érotique, en mémoire d'Anne de Lenclos, avec Abdelhamid Ladhari.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const jar = await cookies();
  const lang: Lang = jar.get("enclos_lang")?.value === "ar" ? "ar" : "fr";

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${cormorant.variable} ${naskh.variable} ${source.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="paper flex min-h-full flex-col" suppressHydrationWarning>
        <LangProvider initialLang={lang}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BookTurn />
        </LangProvider>
      </body>
    </html>
  );
}
