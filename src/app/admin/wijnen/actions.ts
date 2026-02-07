"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { wineTypeSchema, wineBodySchema } from "@/lib/schemas/wine";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const wineFormSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  type: wineTypeSchema,
  body: wineBodySchema.nullable(),
  description: z.string().nullable(),
  vintage: z.coerce.number().int().min(1900).max(2100).nullable(),
  alcohol_percentage: z.coerce.number().min(0).max(100).nullable(),
  price_cents: z.coerce.number().int().min(0),
  compare_at_price_cents: z.coerce.number().int().min(0).nullable(),
  sku: z.string().nullable(),
  image_url: z.string().url().nullable().or(z.literal("")),
  tasting_notes: z.string().nullable(),
  food_pairing: z.string().nullable(),
  serving_temperature: z.string().nullable(),
  stock_quantity: z.coerce.number().int().min(0),
  volume_ml: z.coerce.number().int().min(0).default(750),
  is_active: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  region_id: z.string().uuid().nullable(),
  producer_id: z.string().uuid().nullable(),
});

function parseFormData(formData: FormData) {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "is_active" || key === "is_featured") {
      raw[key] = value === "on" || value === "true";
    } else if (
      [
        "vintage",
        "alcohol_percentage",
        "price_cents",
        "compare_at_price_cents",
        "stock_quantity",
        "volume_ml",
      ].includes(key)
    ) {
      raw[key] = value === "" ? null : Number(value);
    } else if (
      [
        "body",
        "description",
        "sku",
        "image_url",
        "tasting_notes",
        "food_pairing",
        "serving_temperature",
        "region_id",
        "producer_id",
      ].includes(key)
    ) {
      raw[key] = value === "" ? null : String(value);
    } else {
      raw[key] = String(value);
    }
  }

  if (!formData.has("is_active")) raw.is_active = false;
  if (!formData.has("is_featured")) raw.is_featured = false;

  return raw;
}

export async function createWine(formData: FormData) {
  const raw = parseFormData(formData);
  const parsed = wineFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = createServiceRoleClient();
  const slug = slugify(parsed.data.name);

  const { error } = await supabase.from("wines").insert({
    ...parsed.data,
    slug,
    image_url: parsed.data.image_url || null,
  });

  if (error) {
    return { error: { _form: [error.message] } };
  }

  revalidatePath("/admin/wijnen");
  revalidatePath("/wijnen");
  redirect("/admin/wijnen");
}

export async function updateWine(id: string, formData: FormData) {
  const raw = parseFormData(formData);
  const parsed = wineFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("wines")
    .update({
      ...parsed.data,
      image_url: parsed.data.image_url || null,
    })
    .eq("id", id);

  if (error) {
    return { error: { _form: [error.message] } };
  }

  revalidatePath("/admin/wijnen");
  revalidatePath("/wijnen");
  redirect("/admin/wijnen");
}

export async function toggleWineActive(id: string, isActive: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("wines").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/wijnen");
  revalidatePath("/wijnen");
}

export async function toggleWineFeatured(id: string, isFeatured: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("wines").update({ is_featured: isFeatured }).eq("id", id);
  revalidatePath("/admin/wijnen");
  revalidatePath("/wijnen");
}

export async function deleteWine(id: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("wines").delete().eq("id", id);
  revalidatePath("/admin/wijnen");
  revalidatePath("/wijnen");
  redirect("/admin/wijnen");
}
