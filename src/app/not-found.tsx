import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="font-display text-4xl">Page introuvable</h1>
      <Link href="/" className="mt-6 inline-block rounded-full bg-sky px-5 py-2 font-display">
        Accueil
      </Link>
    </div>
  );
}
