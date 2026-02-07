import Link from "next/link";

export default function AdminAccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite p-6">
      <div className="border-2 border-ink bg-offwhite p-8 max-w-md text-center brutal-shadow">
        <h1 className="font-display text-display-sm text-ink mb-4">
          GEEN TOEGANG
        </h1>
        <p className="font-body text-base text-ink/60 mb-6">
          Je hebt geen admin-rechten voor VINO12. Neem contact op met de
          beheerder als je denkt dat dit een fout is.
        </p>
        <Link
          href="/"
          className="inline-block font-accent text-xs font-bold uppercase tracking-widest px-6 py-3 border-2 border-ink bg-ink text-offwhite hover:bg-wine hover:border-wine transition-colors"
        >
          Terug naar shop
        </Link>
      </div>
    </div>
  );
}
