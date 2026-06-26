import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { permissions } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { brandingSchema, organizationSettingsSchema, profileSchema, settingsSearchSchema, userPreferenceSchema } from "@/lib/settings/schemas";

const integrationCatalog = [
  ["supabase", "Supabase", "CONNECTED"],
  ["browser_push", "Browser Push", "CONNECTED"],
  ["ollama", "Ollama", "NOT_CONNECTED"],
  ["openai", "OpenAI", "NOT_CONNECTED"],
  ["gemini", "Gemini", "NOT_CONNECTED"],
  ["google_workspace", "Google Workspace", "NOT_CONNECTED"],
  ["microsoft_365", "Microsoft 365", "NOT_CONNECTED"],
  ["slack", "Slack", "NOT_CONNECTED"],
  ["teams", "Microsoft Teams", "NOT_CONNECTED"],
  ["zapier", "Zapier", "NOT_CONNECTED"],
  ["circle_import", "Circle Import Tool", "NOT_CONNECTED"],
  ["webhooks", "Webhooks", "NOT_CONNECTED"],
] as const;

export async function ensureSettingsDefaults(user: AuthenticatedAppUser) {
  await Promise.all([
    prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {},
      create: { organizationId: user.organizationId, userId: user.id },
    }),
    prisma.organizationBranding.upsert({
      where: { organizationId: user.organizationId },
      update: {},
      create: { organizationId: user.organizationId },
    }),
    ...integrationCatalog.map(([provider, name, status]) =>
      prisma.integration.upsert({
        where: { organizationId_provider: { organizationId: user.organizationId, provider } },
        update: {},
        create: { organizationId: user.organizationId, provider, name, status, isEnabled: status === "CONNECTED" },
      }),
    ),
  ]);
}

export async function getUserSettingsData(user: AuthenticatedAppUser) {
  await ensureSettingsDefaults(user);

  const [profile, preferences, notificationPreference, organization, branding] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.userPreference.findUnique({ where: { userId: user.id } }),
    prisma.notificationPreference.upsert({ where: { userId: user.id }, update: {}, create: { organizationId: user.organizationId, userId: user.id } }),
    prisma.organization.findUnique({ where: { id: user.organizationId } }),
    prisma.organizationBranding.findUnique({ where: { organizationId: user.organizationId } }),
  ]);

  if (!profile || !preferences || !organization || !branding) {
    throw new Error("Settings profile not found.");
  }

  return { profile, preferences, notificationPreference, organization, branding };
}

export async function updateUserProfile(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = profileSchema.parse(payload);
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.name,
      avatarUrl: parsed.avatarUrl || null,
      phone: parsed.phone || null,
      jobTitle: parsed.jobTitle || null,
      bio: parsed.bio || null,
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: user.organizationId,
      userId: user.id,
      action: "account.profile.updated",
      entityType: "user",
      entityId: user.id,
      metadata: { description: `${user.name} updated profile settings` },
    },
  });

  return updated;
}

export async function updateUserPreferences(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = userPreferenceSchema.parse(payload);
  return prisma.userPreference.upsert({
    where: { userId: user.id },
    update: parsed,
    create: { organizationId: user.organizationId, userId: user.id, ...parsed },
  });
}

export async function getOrganizationSettingsData(user: AuthenticatedAppUser) {
  await ensureSettingsDefaults(user);
  const [organization, branding, integrations, auditLogs] = await Promise.all([
    prisma.organization.findUnique({ where: { id: user.organizationId }, include: { _count: { select: { users: true, leads: true, resources: true, communityPosts: true } } } }),
    prisma.organizationBranding.findUnique({ where: { organizationId: user.organizationId } }),
    prisma.integration.findMany({ where: { organizationId: user.organizationId }, orderBy: { name: "asc" } }),
    prisma.activityLog.findMany({ where: { organizationId: user.organizationId }, include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  if (!organization || !branding) {
    throw new Error("Organization settings not found.");
  }

  return { organization, branding, integrations, auditLogs };
}

export async function updateOrganizationSettings(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = organizationSettingsSchema.parse(payload);
  requireOrganizationAccess(user, user.organizationId);

  const updated = await prisma.organization.update({
    where: { id: user.organizationId },
    data: {
      name: parsed.name,
      slug: parsed.slug,
      logoUrl: parsed.logoUrl || null,
      tagline: parsed.tagline || null,
      website: parsed.website || null,
      contactEmail: parsed.contactEmail || null,
      supportPhone: parsed.supportPhone || null,
      primaryColor: undefined,
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: user.organizationId,
      userId: user.id,
      action: "admin.organization.updated",
      entityType: "organization",
      entityId: user.organizationId,
      metadata: { description: `${user.name} updated organization settings` },
    },
  });

  return updated;
}

export async function updateOrganizationBranding(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = brandingSchema.parse(payload);
  return prisma.organizationBranding.upsert({
    where: { organizationId: user.organizationId },
    update: {
      appName: parsed.appName,
      primaryColor: parsed.primaryColor,
      secondaryColor: parsed.secondaryColor,
      accentColor: parsed.accentColor,
      lightLogoUrl: parsed.lightLogoUrl || null,
      darkLogoUrl: parsed.darkLogoUrl || null,
      faviconUrl: parsed.faviconUrl || null,
      splashImageUrl: parsed.splashImageUrl || null,
      customDomain: parsed.customDomain || null,
    },
    create: {
      organizationId: user.organizationId,
      appName: parsed.appName,
      primaryColor: parsed.primaryColor,
      secondaryColor: parsed.secondaryColor,
      accentColor: parsed.accentColor,
      lightLogoUrl: parsed.lightLogoUrl || null,
      darkLogoUrl: parsed.darkLogoUrl || null,
      faviconUrl: parsed.faviconUrl || null,
      splashImageUrl: parsed.splashImageUrl || null,
      customDomain: parsed.customDomain || null,
    },
  });
}

export function getRolePermissionGroups() {
  return [
    { group: "Admin", permissions: ["manage_users", "manage_settings"] },
    { group: "Learning", permissions: ["view_learning", "manage_courses"] },
    { group: "Resources", permissions: ["view_resources", "manage_resources"] },
    { group: "Leads", permissions: ["submit_leads", "view_own_leads", "manage_leads"] },
    { group: "Community", permissions: ["view_community", "manage_community"] },
    { group: "Notifications", permissions: ["view_notifications"] },
  ].map((group) => ({ ...group, permissions: group.permissions.filter((permission) => permissions.includes(permission as (typeof permissions)[number])) }));
}

export async function searchSettings(user: AuthenticatedAppUser, payload: unknown) {
  const { query } = settingsSearchSchema.parse(payload);
  const lower = query.toLowerCase();
  const staticResults = ["General", "Profile", "Organization", "Branding", "Users", "Roles", "Notifications", "Security", "Integrations", "Audit Logs"].filter((item) => item.toLowerCase().includes(lower));
  const users = await prisma.user.findMany({
    where: { organizationId: user.organizationId, OR: [{ name: { contains: query, mode: "insensitive" } }, { email: { contains: query, mode: "insensitive" } }] },
    select: { id: true, name: true, email: true },
    take: 5,
  });

  return { settings: staticResults, users };
}
