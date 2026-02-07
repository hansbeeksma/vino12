"use client";

import { useActionState, useState } from "react";
import { submitReview } from "@/app/(shop)/wijn/[slug]/actions";
import { StarRating } from "./StarRating";

interface ReviewFormProps {
  wineId: string;
  slug: string;
  existingReview?: {
    rating: number;
    title: string | null;
    body: string | null;
  } | null;
}

export function ReviewForm({ wineId, slug, existingReview }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [state, formAction, pending] = useActionState(submitReview, {
    success: false,
  });

  if (state.success) {
    return (
      <div className="border-2 border-emerald bg-emerald/10 p-4">
        <p className="font-body text-sm text-emerald">
          Bedankt voor je review! Deze wordt zichtbaar na goedkeuring.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="wine_id" value={wineId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-2">
          Beoordeling *
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
      </div>

      <div>
        <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
          Titel
        </label>
        <input
          type="text"
          name="title"
          defaultValue={existingReview?.title ?? ""}
          placeholder="Korte samenvatting"
          maxLength={100}
          className="w-full font-body text-base border-2 border-ink px-4 py-3 bg-offwhite focus:outline-hidden focus:border-wine placeholder:text-ink/30"
        />
      </div>

      <div>
        <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
          Review
        </label>
        <textarea
          name="body"
          defaultValue={existingReview?.body ?? ""}
          placeholder="Vertel over je ervaring met deze wijn..."
          rows={4}
          maxLength={1000}
          className="w-full font-body text-base border-2 border-ink px-4 py-3 bg-offwhite focus:outline-hidden focus:border-wine placeholder:text-ink/30 resize-none"
        />
      </div>

      {state.error && (
        <div className="border-2 border-wine bg-wine/10 p-3">
          <p className="font-body text-sm text-wine">{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink bg-ink text-offwhite px-6 py-3 hover:bg-wine hover:border-wine transition-colors disabled:opacity-50"
      >
        {pending
          ? "Verzenden..."
          : existingReview
            ? "Review bijwerken"
            : "Review plaatsen"}
      </button>
    </form>
  );
}
