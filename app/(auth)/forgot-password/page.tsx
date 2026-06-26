import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brand } from "@/lib/config/brand";

export default function ForgotPasswordPage() {
  return (
    <Card className="rounded-3xl">
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{brand.name}</p>
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>
          Enter your email to receive a reset link once password recovery is connected.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Work email</label>
          <Input placeholder="name@company.com" type="email" />
        </div>
        <Button className="w-full">Send reset link</Button>
      </CardContent>
    </Card>
  );
}
