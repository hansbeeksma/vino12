import { createServerSupabaseClient } from "./server";

export type UserRole = "admin" | "contributor" | "customer";

export interface RoleResult {
  user: {
    id: string;
    email: string | undefined;
  };
  role: UserRole;
}

function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.length > 0 && adminEmails.includes(email.toLowerCase());
}

function isContributorEmail(email: string | undefined): boolean {
  if (!email) return false;
  const contributorEmails = (process.env.CONTRIBUTOR_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return (
    contributorEmails.length > 0 &&
    contributorEmails.includes(email.toLowerCase())
  );
}

export async function getUserRole(): Promise<RoleResult | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const hasAdminRole = user.app_metadata?.role === "admin";

  if (hasAdminRole || isAdminEmail(user.email)) {
    return { user: { id: user.id, email: user.email }, role: "admin" };
  }

  if (isContributorEmail(user.email)) {
    return { user: { id: user.id, email: user.email }, role: "contributor" };
  }

  return { user: { id: user.id, email: user.email }, role: "customer" };
}
