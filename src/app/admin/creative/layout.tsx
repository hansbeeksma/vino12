import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";

export default function CreativeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isFeatureEnabled("admin.creative")) {
    redirect("/admin");
  }

  return <div>{children}</div>;
}
