import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { brand } from "@/lib/config/brand";

export default async function AcceptInvitePage() {
  const result = await getCurrentUser();

  if (result.kind === "authenticated") {
    if (result.user.status === "ACTIVE") {
      redirect("/app/dashboard");
    }

    if (result.user.status === "SUSPENDED") {
      redirect("/account-suspended");
    }
  }

  return (
    <Card className="rounded-3xl">
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{brand.name}</p>
        <CardTitle className="text-2xl">Accept invite</CardTitle>
        <CardDescription>
          Finish setting up your Pohuntoon account to join your organization workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full name</label>
          <Input defaultValue={result.kind === "authenticated" ? result.user.name : ""} placeholder="Your full name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Create password</label>
          <Input placeholder="Create a secure password" type="password" />
        </div>
        <Button className="w-full">Activate account</Button>
      </CardContent>
    </Card>
  );
}
