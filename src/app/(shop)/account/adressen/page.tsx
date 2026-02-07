import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AddressForm } from "./AddressForm";
import { AddressCard } from "./AddressCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Adressen | Mijn Account | VINO12",
};

interface Address {
  id: string;
  label: string;
  street: string;
  house_number: string;
  house_number_addition: string | null;
  postal_code: string;
  city: string;
  is_default: boolean;
}

export default async function AddressesPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  let addresses: Address[] = [];

  if (customer) {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("customer_id", customer.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    addresses = (data as Address[]) ?? [];
  }

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">ADRESBOEK</h1>

      {addresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}

      <div className="border-2 border-ink bg-offwhite p-6">
        <h2 className="font-display text-lg font-bold text-ink mb-4">
          Nieuw adres toevoegen
        </h2>
        <AddressForm />
      </div>
    </div>
  );
}
