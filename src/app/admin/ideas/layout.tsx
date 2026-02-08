import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export default function IdeasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isFeatureEnabled("admin.ideas")) {
    redirect("/admin");
  }

  return children;
}
