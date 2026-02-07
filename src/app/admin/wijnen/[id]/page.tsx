import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { updateWine, deleteWine } from "../actions";
import { WineForm } from "../WineForm";
import { DeleteWineButton } from "./DeleteWineButton";

export const metadata: Metadata = {
  title: "Wijn bewerken | Admin | VINO12",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditWinePage({ params }: Props) {
  const { id } = await params;
  const supabase = createServiceRoleClient();

  const [{ data: wine }, { data: regions }, { data: producers }] =
    await Promise.all([
      supabase.from("wines").select("*").eq("id", id).single(),
      supabase.from("regions").select("id, name").order("name"),
      supabase.from("producers").select("id, name").order("name"),
    ]);

  if (!wine) notFound();

  const boundUpdate = async (formData: FormData) => {
    "use server";
    return updateWine(id, formData);
  };

  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-6">
        WIJN BEWERKEN
      </h1>
      <WineForm
        wine={wine}
        regions={regions ?? []}
        producers={producers ?? []}
        action={boundUpdate}
      />
      <div className="mt-8 pt-6 border-t-2 border-ink/10">
        <DeleteWineButton id={id} onDelete={deleteWine} />
      </div>
    </div>
  );
}
