"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getAuthenticatedCustomer() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, customer: null };

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  return { supabase, user, customer };
}

// ─── Profile ─────────────────────────────────────────────

export async function updateProfile(
  _prev: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user, customer } = await getAuthenticatedCustomer();
  if (!user) return { success: false, error: "Niet ingelogd" };

  const firstName = (formData.get("first_name") as string)?.trim();
  const lastName = (formData.get("last_name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!firstName || !lastName) {
    return { success: false, error: "Voornaam en achternaam zijn verplicht" };
  }

  if (customer) {
    const { error } = await supabase
      .from("customers")
      .update({ first_name: firstName, last_name: lastName, phone })
      .eq("id", customer.id);

    if (error) return { success: false, error: "Opslaan mislukt" };
  } else {
    const { error } = await supabase.from("customers").insert({
      auth_user_id: user.id,
      email: user.email!,
      first_name: firstName,
      last_name: lastName,
      phone,
    });

    if (error) return { success: false, error: "Aanmaken mislukt" };
  }

  revalidatePath("/account");
  return { success: true };
}

// ─── Addresses ───────────────────────────────────────────

export async function createAddress(
  _prev: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user } = await getAuthenticatedCustomer();
  if (!user) return { success: false, error: "Niet ingelogd" };

  // Ensure customer exists
  let { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!customer) {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({ auth_user_id: user.id, email: user.email! })
      .select("id")
      .single();
    customer = newCustomer;
  }

  if (!customer) return { success: false, error: "Klant niet gevonden" };

  const label = (formData.get("label") as string)?.trim() || "Thuis";
  const street = (formData.get("street") as string)?.trim();
  const houseNumber = (formData.get("house_number") as string)?.trim();
  const houseNumberAddition =
    (formData.get("house_number_addition") as string)?.trim() || null;
  const postalCode = (formData.get("postal_code") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const isDefault = formData.get("is_default") === "on";

  if (!street || !houseNumber || !postalCode || !city) {
    return { success: false, error: "Vul alle verplichte velden in" };
  }

  // If setting as default, unset other defaults first
  if (isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("customer_id", customer.id);
  }

  const { error } = await supabase.from("addresses").insert({
    customer_id: customer.id,
    label,
    street,
    house_number: houseNumber,
    house_number_addition: houseNumberAddition,
    postal_code: postalCode,
    city,
    is_default: isDefault,
  });

  if (error) return { success: false, error: "Adres toevoegen mislukt" };

  revalidatePath("/account/adressen");
  revalidatePath("/account");
  return { success: true };
}

export async function deleteAddress(
  addressId: string,
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user, customer } = await getAuthenticatedCustomer();
  if (!user || !customer) return { success: false, error: "Niet ingelogd" };

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("customer_id", customer.id);

  if (error) return { success: false, error: "Verwijderen mislukt" };

  revalidatePath("/account/adressen");
  revalidatePath("/account");
  return { success: true };
}

export async function setDefaultAddress(
  addressId: string,
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user, customer } = await getAuthenticatedCustomer();
  if (!user || !customer) return { success: false, error: "Niet ingelogd" };

  // Unset all defaults
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("customer_id", customer.id);

  // Set new default
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("customer_id", customer.id);

  if (error) return { success: false, error: "Instellen mislukt" };

  revalidatePath("/account/adressen");
  return { success: true };
}
