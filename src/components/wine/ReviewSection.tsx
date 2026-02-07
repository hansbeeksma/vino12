import {
  getApprovedReviews,
  getReviewStats,
  getUserReview,
} from "@/lib/api/reviews";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StarRating } from "./StarRating";
import { ReviewForm } from "./ReviewForm";

interface ReviewSectionProps {
  wineId: string;
  slug: string;
}

export async function ReviewSection({ wineId, slug }: ReviewSectionProps) {
  const [reviews, stats] = await Promise.all([
    getApprovedReviews(wineId),
    getReviewStats(wineId),
  ]);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingReview = null;
  let customerId: string | null = null;

  if (user) {
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (customer) {
      customerId = customer.id;
      existingReview = await getUserReview(wineId, customer.id);
    }
  }

  return (
    <div className="border-t-2 border-ink mt-12 pt-12">
      <div className="container-brutal px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-display-sm text-ink">REVIEWS</h2>
          {stats.count > 0 && (
            <div className="flex items-center gap-3">
              <StarRating rating={stats.average} size="md" />
              <span className="font-display text-xl font-bold text-ink">
                {stats.average}
              </span>
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
                ({stats.count} {stats.count === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review form */}
          <div className="lg:col-span-1">
            <div className="border-2 border-ink bg-offwhite p-6">
              <h3 className="font-display text-lg font-bold text-ink mb-4">
                {existingReview ? "Jouw review" : "Schrijf een review"}
              </h3>
              {user ? (
                <ReviewForm
                  wineId={wineId}
                  slug={slug}
                  existingReview={existingReview}
                />
              ) : (
                <div>
                  <p className="font-body text-sm text-ink/60 mb-4">
                    Log in om een review te plaatsen.
                  </p>
                  <a
                    href="/login"
                    className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink bg-ink text-offwhite px-6 py-3 hover:bg-wine hover:border-wine transition-colors inline-block"
                  >
                    Inloggen
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="border-2 border-ink bg-offwhite p-8 text-center">
                <p className="font-body text-base text-ink/50">
                  Er zijn nog geen reviews voor deze wijn.
                </p>
                <p className="font-body text-sm text-ink/30 mt-1">
                  Wees de eerste!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const customer = review.customer as {
                    first_name: string;
                    last_name: string;
                  } | null;
                  const displayName = customer
                    ? `${customer.first_name} ${customer.last_name.charAt(0)}.`
                    : "Anoniem";

                  return (
                    <div
                      key={review.id}
                      className={`border-2 bg-offwhite p-4 ${
                        review.customer_id === customerId
                          ? "border-wine"
                          : "border-ink"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <StarRating rating={review.rating} size="sm" />
                            {review.is_verified_purchase && (
                              <span className="font-accent text-[9px] uppercase tracking-widest text-emerald border border-emerald px-1.5 py-0.5">
                                Geverifieerd
                              </span>
                            )}
                          </div>
                          {review.title && (
                            <h4 className="font-display text-base font-bold text-ink">
                              {review.title}
                            </h4>
                          )}
                        </div>
                        <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
                          {new Date(review.created_at).toLocaleDateString(
                            "nl-NL",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      {review.body && (
                        <p className="font-body text-sm text-ink/70 mb-2">
                          {review.body}
                        </p>
                      )}
                      <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
                        {displayName}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
