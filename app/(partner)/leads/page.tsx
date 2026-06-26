import { redirect } from "next/navigation";

export default function LegacyLeadsRedirect() {
  redirect("/app/leads");
}
