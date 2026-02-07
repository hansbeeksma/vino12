import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { StarRating } from "@/components/wine/StarRating";
import { ReviewActions } from "./ReviewActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews | Admin | VINO12",
};

export default async function AdminReviewsPage() {
  const supabase = createServiceRoleClient();

  const { data: reviews } = await supabase
    .from("wine_reviews")
    .select(
      "*, customer:customers(first_name, last_name, email), wine:wines(name, slug)",
    )
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false });

  const pending = (reviews ?? []).filter((r) => !r.is_approved);
  const approved = (reviews ?? []).filter((r) => r.is_approved);

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">REVIEWS</h1>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-lg font-bold text-wine mb-4">
            Wachtend op goedkeuring ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display text-lg font-bold text-ink mb-4">
          Goedgekeurd ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="font-body text-sm text-ink/50">
            Nog geen goedgekeurde reviews.
          </p>
        ) : (
          <div className="space-y-3">
            {approved.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: {
    id: string;
    rating: number;
    title: string | null;
    body: string | null;
    is_approved: boolean;
    is_verified_purchase: boolean;
    created_at: string;
    customer: { first_name: string; last_name: string; email: string } | null;
    wine: { name: string; slug: string } | null;
  };
}) {
  const customer = review.customer as {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  const wine = review.wine as { name: string; slug: string } | null;

  return (
    <div
      className={`border-2 bg-offwhite p-4 ${review.is_approved ? "border-ink" : "border-wine"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <StarRating rating={review.rating} size="sm" />
            {review.is_verified_purchase && (
              <span className="font-accent text-[9px] uppercase tracking-widest text-emerald border border-emerald px-1.5 py-0.5">
                Geverifieerd
              </span>
            )}
            {!review.is_approved && (
              <span className="font-accent text-[9px] uppercase tracking-widest text-wine border border-wine px-1.5 py-0.5">
                Pending
              </span>
            )}
          </div>
          {review.title && (
            <h3 className="font-display text-base font-bold text-ink">
              {review.title}
            </h3>
          )}
          {review.body && (
            <p className="font-body text-sm text-ink/70 mt-1">{review.body}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
              {customer
                ? `${customer.first_name} ${customer.last_name} (${customer.email})`
                : "Onbekend"}
            </span>
            <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
              {wine?.name ?? "Onbekende wijn"}
            </span>
            <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
              {new Date(review.created_at).toLocaleDateString("nl-NL")}
            </span>
          </div>
        </div>
        <ReviewActions reviewId={review.id} isApproved={review.is_approved} />
      </div>
    </div>
  );
}
