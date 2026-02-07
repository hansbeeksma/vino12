import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { gdprDeletionConfirmEmail } from "@/lib/email/templates";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceRoleClient();
  const email = user.email;

  // 1. Anonymize orders (keep for fiscal compliance, 7 year retention)
  await serviceClient
    .from("orders")
    .update({
      email: "deleted@anonymous.invalid",
      shipping_name: "VERWIJDERD",
      shipping_address: null,
      shipping_city: null,
      shipping_postal_code: null,
      shipping_phone: null,
    })
    .eq("customer_id", user.id);

  // 2. Delete customer record (cascades to addresses)
  await serviceClient.from("customers").delete().eq("auth_user_id", user.id);

  // 3. Delete age verification records
  await serviceClient
    .from("age_verifications")
    .delete()
    .eq("customer_id", user.id);

  // 4. Delete Supabase Auth user
  await serviceClient.auth.admin.deleteUser(user.id);

  // 5. Send confirmation email
  if (email) {
    await resend.emails
      .send({
        from: "VINO12 <noreply@vino12.com>",
        to: email,
        subject: "Je VINO12 account is verwijderd",
        html: gdprDeletionConfirmEmail(),
      })
      .catch(() => {});
  }

  return NextResponse.json({ deleted: true });
}
