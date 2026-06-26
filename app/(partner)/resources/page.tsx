import { redirect } from "next/navigation";

export default function LegacyResourcesRedirect() {
  redirect("/app/resources");
}
