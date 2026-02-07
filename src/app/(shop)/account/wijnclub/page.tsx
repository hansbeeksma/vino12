import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { SubscriptionActions } from "./SubscriptionActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wijnclub | Mijn Account | VINO12",
};

const PLAN_LABELS: Record<string, string> = {
  monthly: "Maandelijks (6 flessen)",
  bimonthly: "Tweemaandelijks (12 flessen)",
  quarterly: "Per kwartaal (12 flessen)",
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: "Actief", color: "bg-emerald text-offwhite" },
  paused: { label: "Gepauzeerd", color: "bg-champagne text-ink" },
  cancelled: { label: "Opgezegd", color: "bg-ink/10 text-ink/50" },
};

export default async function WineClubAccountPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const serviceClient = createServiceRoleClient();
  const { data: subscription } = await serviceClient
    .from("wine_club_subscriptions")
    .select("*")
    .eq("customer_id", user.id)
    .neq("status", "cancelled")
    .maybeSingle();

  if (!subscription) {
    return (
      <div>
        <h1 className="font-display text-display-sm text-ink mb-6">WIJNCLUB</h1>
        <div className="border-2 border-ink bg-offwhite p-8 text-center">
          <p className="font-body text-base text-ink/50 mb-4">
            Je hebt nog geen wijnclub abonnement.
          </p>
          <Link
            href="/wijnclub"
            className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink bg-ink text-offwhite px-8 py-4 hover:bg-wine hover:border-wine transition-colors inline-block"
          >
            Bekijk abonnementen →
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_MAP[subscription.status] ?? {
    label: subscription.status,
    color: "bg-ink/10 text-ink",
  };

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">WIJNCLUB</h1>

      <div className="border-2 border-ink bg-offwhite p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">
            Jouw abonnement
          </h2>
          <span
            className={`font-accent text-[10px] uppercase tracking-widest px-3 py-1 border border-ink ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-1">
              Plan
            </p>
            <p className="font-body text-base text-ink">
              {PLAN_LABELS[subscription.plan_type] ?? subscription.plan_type}
            </p>
          </div>
          <div>
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-1">
              Prijs
            </p>
            <p className="font-display text-xl font-bold text-ink">
              {formatPrice(subscription.price_cents)}
            </p>
          </div>
          <div>
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-1">
              Volgende verzending
            </p>
            <p className="font-body text-base text-ink">
              {subscription.next_shipment_date
                ? new Date(subscription.next_shipment_date).toLocaleDateString(
                    "nl-NL",
                    { day: "numeric", month: "long", year: "numeric" },
                  )
                : "Nog niet gepland"}
            </p>
          </div>
        </div>

        {subscription.preferences &&
          Object.keys(subscription.preferences).length > 0 && (
            <div className="border-t-2 border-ink pt-4">
              <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-2">
                Voorkeuren
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  subscription.preferences as {
                    preferred_types?: string[];
                    preferred_regions?: string[];
                  }
                ).preferred_types?.map((type: string) => (
                  <span
                    key={type}
                    className="font-accent text-[10px] uppercase tracking-widest bg-champagne border border-ink px-2 py-1"
                  >
                    {type}
                  </span>
                ))}
                {(
                  subscription.preferences as {
                    preferred_regions?: string[];
                  }
                ).preferred_regions?.map((region: string) => (
                  <span
                    key={region}
                    className="font-accent text-[10px] uppercase tracking-widest bg-champagne border border-ink px-2 py-1"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}

        <div className="border-t-2 border-ink pt-4">
          <SubscriptionActions
            status={subscription.status as "active" | "paused" | "cancelled"}
          />
        </div>
      </div>

      <p className="font-accent text-[10px] uppercase tracking-widest text-ink/30 mt-4">
        Lid sinds{" "}
        {new Date(subscription.created_at).toLocaleDateString("nl-NL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
