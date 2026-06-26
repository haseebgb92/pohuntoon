import { redirect } from "next/navigation";

export default function LegacyNotificationsRedirect() {
  redirect("/app/notifications");
}
