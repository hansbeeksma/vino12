"use client";

import Link from "next/link";
import { IdeaInputForm } from "@/components/creative/IdeaInputForm";

export default function NieuwIdeePage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/creative"
          className="font-accent text-[10px] uppercase tracking-widest text-ink/50 hover:text-wine mb-2 inline-block"
        >
          ← Terug naar werkruimte
        </Link>
        <h1 className="font-display text-display-sm text-ink">NIEUW IDEE</h1>
        <p className="font-body text-sm text-ink/50 mt-1">
          Deel je idee door te typen of te dicteren
        </p>
      </div>

      <div className="max-w-2xl">
        <IdeaInputForm />
      </div>
    </div>
  );
}
