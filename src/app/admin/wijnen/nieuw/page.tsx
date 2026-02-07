import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createWine } from "../actions";
import { WineForm } from "../WineForm";

export const metadata: Metadata = {
  title: "Nieuwe wijn | Admin | VINO12",
};

export default async function NewWinePage() {
  const supabase = createServiceRoleClient();

  const [{ data: regions }, { data: producers }] = await Promise.all([
    supabase.from("regions").select("id, name").order("name"),
    supabase.from("producers").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">
        NIEUWE WIJN
      </h1>
      <WineForm
        regions={regions ?? []}
        producers={producers ?? []}
        action={createWine}
      />
    </div>
  );
}
