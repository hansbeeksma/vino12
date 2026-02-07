import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profiel | Mijn Account | VINO12",
};

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("first_name, last_name, phone")
    .eq("auth_user_id", user.id)
    .single();

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">PROFIEL</h1>

      <div className="border-2 border-ink bg-offwhite p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-ink">
            E-mailadres
          </h2>
          <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
            Kan niet gewijzigd worden
          </span>
        </div>
        <p className="font-body text-base text-ink">{user.email}</p>
      </div>

      <div className="border-2 border-ink bg-offwhite p-6">
        <h2 className="font-display text-lg font-bold text-ink mb-4">
          Persoonlijke gegevens
        </h2>
        <ProfileForm
          defaultValues={{
            first_name: customer?.first_name ?? "",
            last_name: customer?.last_name ?? "",
            phone: customer?.phone ?? "",
          }}
        />
      </div>
    </div>
  );
}
