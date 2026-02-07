"use client";

import { useTransition } from "react";
import { approveReview, rejectReview } from "./actions";

interface ReviewActionsProps {
  reviewId: string;
  isApproved: boolean;
}

export function ReviewActions({ reviewId, isApproved }: ReviewActionsProps) {
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveReview(reviewId);
    });
  }

  function handleReject() {
    startTransition(async () => {
      await rejectReview(reviewId);
    });
  }

  return (
    <div className="flex gap-2">
      {!isApproved && (
        <button
          type="button"
          onClick={handleApprove}
          disabled={pending}
          className="font-accent text-[10px] uppercase tracking-widest border-2 border-emerald text-emerald px-3 py-1.5 hover:bg-emerald hover:text-offwhite transition-colors disabled:opacity-50"
        >
          {pending ? "..." : "Goedkeuren"}
        </button>
      )}
      <button
        type="button"
        onClick={handleReject}
        disabled={pending}
        className="font-accent text-[10px] uppercase tracking-widest border-2 border-wine text-wine px-3 py-1.5 hover:bg-wine hover:text-offwhite transition-colors disabled:opacity-50"
      >
        {pending ? "..." : "Verwijderen"}
      </button>
    </div>
  );
}
