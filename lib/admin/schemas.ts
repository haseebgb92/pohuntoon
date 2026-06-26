import { z } from "zod";

export const adminSearchSchema = z.object({
  query: z.string().trim().min(1).max(80),
});

export const userInviteSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  role: z.enum(["SUPER_ADMIN", "ORG_ADMIN", "PARTNER_MANAGER", "PARTNER", "VIEWER"]),
});

export const userUpdateSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ORG_ADMIN", "PARTNER_MANAGER", "PARTNER", "VIEWER"]).optional(),
  status: z.enum(["ACTIVE", "INVITED", "SUSPENDED"]).optional(),
  action: z.enum(["SUSPEND", "ACTIVATE", "RESET_PASSWORD"]).optional(),
});

export const organizationUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().trim().url().optional().or(z.literal("")),
  primaryColor: z.string().trim().max(20).optional().or(z.literal("")),
});
