import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-offwhite min-h-screen flex items-center justify-center section-padding">
      <div className="text-center">
        <h1 className="font-display text-8xl font-bold text-wine mb-4">404</h1>
        <p className="font-body text-xl text-ink/70 mb-8">
          Deze pagina bestaat niet of is verhuisd.
        </p>
        <Link
          href="/"
          className="font-accent text-xs uppercase tracking-widest border-2 border-ink px-6 py-3 brutal-shadow brutal-hover inline-block bg-offwhite hover:bg-champagne"
        >
          Terug naar home
        </Link>
      </div>
    </div>
  );
}
