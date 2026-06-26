import { login } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brand } from "@/lib/config/brand";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <Card className="rounded-3xl">
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{brand.name}</p>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription>
          Sign in to continue your workspace across learning, resources, and progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={login} className="space-y-4">
          {params.error ? (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {params.error}
            </div>
          ) : null}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Work email</label>
            <Input name="email" placeholder="name@company.com" type="email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Input name="password" placeholder="Enter your password" type="password" />
          </div>
          <Button className="w-full" type="submit">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
