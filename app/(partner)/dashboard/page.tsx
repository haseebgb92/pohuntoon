import { redirect } from "next/navigation";

export default function LegacyPartnerDashboardRedirect() {
  redirect("/app/dashboard");
}
