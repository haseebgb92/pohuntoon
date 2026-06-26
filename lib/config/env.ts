import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_RESOURCE_BUCKET: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    return { ok: false as const, issues: result.error.issues.map((issue) => issue.message) };
  }

  const warnings: string[] = [];
  if (!process.env.DATABASE_URL) {
    warnings.push("DATABASE_URL is required for Prisma commands and runtime database access.");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    warnings.push("NEXT_PUBLIC_SUPABASE_URL is required for Supabase Auth.");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    warnings.push("A Supabase publishable/anon key is required for Supabase Auth.");
  }

  return { ok: true as const, warnings };
}
