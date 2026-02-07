import { createServerSupabaseClient } from "./server";

/**
 * Check if the current user has admin access.
 *
 * Admin access is granted when:
 * 1. User has `role: 'admin'` in Supabase app_metadata, OR
 * 2. User's email is listed in ADMIN_EMAILS env var (comma-separated)
 */
export async function getAdminUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const hasAdminRole = user.app_metadata?.role === "admin";

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isEmailAdmin =
    adminEmails.length > 0 &&
    adminEmails.includes(user.email?.toLowerCase() ?? "");

  if (!hasAdminRole && !isEmailAdmin) return null;

  return user;
}
