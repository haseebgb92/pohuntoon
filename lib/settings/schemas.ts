import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  avatarUrl: z.string().trim().url().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(100).optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
});

export const userPreferenceSchema = z.object({
  language: z.string().trim().min(2).max(20).default("en"),
  timezone: z.string().trim().min(2).max(80).default("UTC"),
  dateFormat: z.string().trim().min(2).max(40).default("MMM d, yyyy"),
  theme: z.enum(["system", "light", "dark"]).default("system"),
  visibility: z.enum(["organization", "private", "public"]).default("organization"),
  activityStatus: z.coerce.boolean().default(true),
});

export const organizationSettingsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().trim().url().optional().or(z.literal("")),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  website: z.string().trim().url().optional().or(z.literal("")),
  contactEmail: z.string().trim().email().optional().or(z.literal("")),
  supportPhone: z.string().trim().max(40).optional().or(z.literal("")),
});

export const brandingSchema = z.object({
  appName: z.string().trim().min(2).max(80).default("Pohuntoon"),
  primaryColor: z.string().trim().max(20).default("#1E4E9A"),
  secondaryColor: z.string().trim().max(20).default("#29B7E5"),
  accentColor: z.string().trim().max(20).default("#6E4BD8"),
  lightLogoUrl: z.string().trim().url().optional().or(z.literal("")),
  darkLogoUrl: z.string().trim().url().optional().or(z.literal("")),
  faviconUrl: z.string().trim().url().optional().or(z.literal("")),
  splashImageUrl: z.string().trim().url().optional().or(z.literal("")),
  customDomain: z.string().trim().max(120).optional().or(z.literal("")),
});

export const settingsSearchSchema = z.object({
  query: z.string().trim().min(1).max(80),
});
