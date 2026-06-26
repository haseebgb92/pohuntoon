import {
  CommunityPostType,
  CourseStatus,
  LeadNoteType,
  LeadStatus,
  LessonProgressStatus,
  LessonType,
  NotificationType,
  Role,
  ResourceKind,
  ResourceStatus,
  UserStatus,
} from "@prisma/client";

import { defaultCommunitySpaces } from "../lib/community/config";
import { prisma } from "../lib/db/prisma";
import { createSlug, withOrganizationScope } from "../lib/db/utils";

async function upsertUser(organizationId: string, email: string, name: string, role: Role) {
  return prisma.user.upsert({
    where: { organizationId_email: { organizationId, email } },
    update: { name, role, status: UserStatus.ACTIVE },
    create: { organizationId, email, name, role, status: UserStatus.ACTIVE },
  });
}

async function main() {
  const organizationName = "Northstar Growth Partners";
  const organizationSlug = createSlug(organizationName);

  const organization = await prisma.organization.upsert({
    where: { slug: organizationSlug },
    update: {
      name: organizationName,
      logoUrl: "https://assets.pohuntoon.demo/northstar-logo.png",
      primaryColor: "#6E4BD8",
      tagline: "Capital readiness for growing teams.",
      website: "https://northstar.pohuntoon.demo",
      contactEmail: "hello@northstar.pohuntoon.demo",
      supportPhone: "+1-555-0100",
    },
    create: {
      name: organizationName,
      slug: organizationSlug,
      logoUrl: "https://assets.pohuntoon.demo/northstar-logo.png",
      primaryColor: "#6E4BD8",
      tagline: "Capital readiness for growing teams.",
      website: "https://northstar.pohuntoon.demo",
      contactEmail: "hello@northstar.pohuntoon.demo",
      supportPhone: "+1-555-0100",
    },
  });

  await prisma.organizationBranding.upsert({
    where: { organizationId: organization.id },
    update: {
      appName: "Pohuntoon",
      primaryColor: "#1E4E9A",
      secondaryColor: "#29B7E5",
      accentColor: "#6E4BD8",
      lightLogoUrl: "https://assets.pohuntoon.demo/logo-light.png",
      darkLogoUrl: "https://assets.pohuntoon.demo/logo-dark.png",
      faviconUrl: "https://assets.pohuntoon.demo/favicon.png",
      splashImageUrl: "https://assets.pohuntoon.demo/splash.png",
    },
    create: {
      organizationId: organization.id,
      appName: "Pohuntoon",
      primaryColor: "#1E4E9A",
      secondaryColor: "#29B7E5",
      accentColor: "#6E4BD8",
      lightLogoUrl: "https://assets.pohuntoon.demo/logo-light.png",
      darkLogoUrl: "https://assets.pohuntoon.demo/logo-dark.png",
      faviconUrl: "https://assets.pohuntoon.demo/favicon.png",
      splashImageUrl: "https://assets.pohuntoon.demo/splash.png",
    },
  });

  const superAdmin = await upsertUser(organization.id, "superadmin@pohuntoon.demo", "Jordan Blake", Role.SUPER_ADMIN);
  const orgAdmin = await upsertUser(organization.id, "admin@pohuntoon.demo", "Morgan Lee", Role.ORG_ADMIN);
  const partnerManager = await upsertUser(organization.id, "manager@pohuntoon.demo", "Ivy Zhang", Role.PARTNER_MANAGER);
  const partner = await upsertUser(organization.id, "partner@pohuntoon.demo", "Avery Cole", Role.PARTNER);
  const viewer = await upsertUser(organization.id, "viewer@pohuntoon.demo", "Riley Stone", Role.VIEWER);

  await prisma.user.update({
    where: { id: partner.id },
    data: {
      phone: "+1-555-0124",
      jobTitle: "Partner Development Lead",
      bio: "Helps growth-stage companies prepare stronger funding opportunities.",
      lastLoginAt: new Date(),
    },
  });

  await prisma.userPreference.upsert({
    where: { userId: partner.id },
    update: { language: "en", timezone: "America/New_York", dateFormat: "MMM d, yyyy" },
    create: { organizationId: organization.id, userId: partner.id, language: "en", timezone: "America/New_York", dateFormat: "MMM d, yyyy" },
  });

  await prisma.notificationPreference.upsert({
    where: { userId: partner.id },
    update: { training: true, leadUpdates: true, announcements: true, browserPush: true },
    create: { organizationId: organization.id, userId: partner.id, training: true, leadUpdates: true, announcements: true, browserPush: true },
  });

  await prisma.notificationPreference.upsert({
    where: { userId: orgAdmin.id },
    update: { training: true, leadUpdates: true, announcements: true, browserPush: true },
    create: { organizationId: organization.id, userId: orgAdmin.id, training: true, leadUpdates: true, announcements: true, browserPush: true },
  });

  await prisma.integration.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.reportedContent.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.savedPost.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.communityReaction.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.communityComment.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.communityPost.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.communitySpace.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.lessonProgress.deleteMany({ where: { userId: { in: [orgAdmin.id, partnerManager.id, partner.id, viewer.id] } } });
  await prisma.notification.deleteMany({ where: { userId: { in: [orgAdmin.id, partnerManager.id, partner.id, viewer.id] } } });
  await prisma.activityLog.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.lead.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.resource.deleteMany({ where: withOrganizationScope(organization.id, {}) });
  await prisma.course.deleteMany({ where: withOrganizationScope(organization.id, {}) });

  const course = await prisma.course.create({
    data: {
      organizationId: organization.id,
      title: "Partner Funding Readiness",
      slug: createSlug("Partner Funding Readiness"),
      description: "A practical onboarding path for identifying, packaging, and submitting high-quality funding opportunities.",
      thumbnailUrl: "https://assets.pohuntoon.demo/courses/funding-readiness.png",
      status: CourseStatus.PUBLISHED,
      sortOrder: 1,
    },
  });

  const moduleRecord = await prisma.module.create({
    data: {
      courseId: course.id,
      title: "Launch Essentials",
      description: "Core concepts every partner should know before submitting opportunities.",
      sortOrder: 1,
    },
  });

  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        moduleId: moduleRecord.id,
        title: "Welcome to Pohuntoon",
        slug: createSlug("Welcome to Pohuntoon"),
        content: "Understand the partner workspace, lead lifecycle, resource center, and notification flow.",
        videoUrl: "https://videos.pohuntoon.demo/welcome",
        durationMinutes: 8,
        lessonType: LessonType.VIDEO,
        sortOrder: 1,
        isRequired: true,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: moduleRecord.id,
        title: "Submitting High-Quality Leads",
        slug: createSlug("Submitting High-Quality Leads"),
        content: "Best practices for collecting company details, contact information, funding purpose, and documents.",
        durationMinutes: 12,
        lessonType: LessonType.TEXT,
        sortOrder: 2,
        isRequired: true,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: moduleRecord.id,
        title: "Funding Document Checklist",
        slug: createSlug("Funding Document Checklist"),
        content: "A reference checklist for bank statements, tax records, invoices, and ownership documents.",
        durationMinutes: 5,
        lessonType: LessonType.PDF,
        sortOrder: 3,
        isRequired: false,
      },
    }),
  ]);

  await prisma.lessonProgress.createMany({
    data: [
      { userId: partner.id, lessonId: lessons[0].id, status: LessonProgressStatus.COMPLETED, completedAt: new Date() },
      { userId: partner.id, lessonId: lessons[1].id, status: LessonProgressStatus.IN_PROGRESS },
      { userId: viewer.id, lessonId: lessons[0].id, status: LessonProgressStatus.IN_PROGRESS },
    ],
  });

  await prisma.resource.createMany({
    data: [
      {
        organizationId: organization.id,
        title: "Partner Pitch Deck",
        description: "Approved partner-facing deck for opportunity discovery conversations.",
        fileUrl: "resources/northstar/partner-pitch-deck-v1.pdf",
        fileType: "application/pdf",
        category: "Sales Enablement",
        version: "1.0",
        originalFileName: "partner-pitch-deck-v1.pdf",
        resourceKind: ResourceKind.FILE,
        status: ResourceStatus.ACTIVE,
        uploadedById: orgAdmin.id,
      },
      {
        organizationId: organization.id,
        title: "Funding Readiness Checklist",
        description: "Checklist partners can share with clients before submitting a lead.",
        fileUrl: "resources/northstar/funding-readiness-checklist.xlsx",
        fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        category: "Lead Management",
        version: "1.0",
        originalFileName: "funding-readiness-checklist.xlsx",
        resourceKind: ResourceKind.FILE,
        status: ResourceStatus.ACTIVE,
        uploadedById: partnerManager.id,
      },
    ],
  });

  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        organizationId: organization.id,
        submittedById: partner.id,
        assignedManagerId: partnerManager.id,
        clientName: "Taylor Brooks",
        clientEmail: "taylor.brooks@example.com",
        clientPhone: "+1-555-0142",
        businessName: "Brooks Capital Group",
        industry: "Financial Services",
        website: "https://brookscapital.example.com",
        businessAgeYears: 6,
        requestedAmount: "125000.00",
        fundingPurpose: "Working capital for new regional contracts.",
        notes: "Client requested a fast review turnaround and has clean bank statements.",
        status: LeadStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    }),
    prisma.lead.create({
      data: {
        organizationId: organization.id,
        submittedById: partner.id,
        assignedManagerId: partnerManager.id,
        clientName: "Samira Khan",
        clientEmail: "samira@brightforge.example.com",
        clientPhone: "+1-555-0188",
        businessName: "BrightForge Manufacturing",
        industry: "Manufacturing",
        businessAgeYears: 11,
        requestedAmount: "275000.00",
        fundingPurpose: "Equipment financing and inventory expansion.",
        status: LeadStatus.UNDER_REVIEW,
        submittedAt: new Date(),
      },
    }),
  ]);

  await prisma.leadNote.create({
    data: {
      leadId: leads[0].id,
      authorId: orgAdmin.id,
      note: "Initial intake reviewed. Waiting for underwriting checklist.",
      noteType: LeadNoteType.INTERNAL,
    },
  });

  await prisma.leadDocument.create({
    data: {
      leadId: leads[0].id,
      fileName: "client-intake-summary.pdf",
      originalFileName: "client-intake-summary.pdf",
      fileUrl: "https://files.pohuntoon.demo/leads/client-intake-summary.pdf",
      fileType: "application/pdf",
      uploadedById: partner.id,
    },
  });

  const spaces = await Promise.all(
    defaultCommunitySpaces.map((space) =>
      prisma.communitySpace.create({
        data: {
          organizationId: organization.id,
          createdById: orgAdmin.id,
          ...space,
          memberCount: 5,
        },
      }),
    ),
  );

  const announcements = spaces.find((space) => space.slug === "announcements") ?? spaces[0];
  const wins = spaces.find((space) => space.slug === "partner-wins") ?? spaces[0];
  const questions = spaces.find((space) => space.slug === "funding-questions") ?? spaces[0];

  const posts = await Promise.all([
    prisma.communityPost.create({
      data: {
        organizationId: organization.id,
        spaceId: announcements.id,
        authorId: orgAdmin.id,
        type: CommunityPostType.ANNOUNCEMENT,
        title: "Welcome to the Pohuntoon demo workspace",
        body: "Use this space to review learning, submit leads, test notifications, and explore partner collaboration workflows.",
        isPinned: true,
      },
    }),
    prisma.communityPost.create({
      data: {
        organizationId: organization.id,
        spaceId: wins.id,
        authorId: partner.id,
        type: CommunityPostType.WIN,
        title: "First manufacturing opportunity moved to review",
        body: "BrightForge is ready for the underwriting checklist. Their team was impressed by how quickly we could package the opportunity.",
      },
    }),
    prisma.communityPost.create({
      data: {
        organizationId: organization.id,
        spaceId: questions.id,
        authorId: viewer.id,
        type: CommunityPostType.QUESTION,
        title: "Which documents should we request first?",
        body: "For working capital requests under $150k, should we start with bank statements or tax returns?",
      },
    }),
  ]);

  await prisma.communityComment.create({
    data: {
      organizationId: organization.id,
      postId: posts[2].id,
      authorId: partnerManager.id,
      body: "Start with the latest four months of bank statements, then request tax returns if underwriting needs more context.",
    },
  });

  await prisma.communityReaction.create({
    data: { organizationId: organization.id, userId: partner.id, postId: posts[0].id, type: "LIKE" },
  });

  await prisma.savedPost.create({
    data: { organizationId: organization.id, userId: partner.id, postId: posts[0].id },
  });

  await prisma.integration.createMany({
    data: [
      { organizationId: organization.id, provider: "supabase", name: "Supabase", status: "CONNECTED", isEnabled: true },
      { organizationId: organization.id, provider: "browser_push", name: "Browser Push", status: "CONNECTED", isEnabled: true },
      { organizationId: organization.id, provider: "openai", name: "OpenAI", status: "NOT_CONNECTED", isEnabled: false },
      { organizationId: organization.id, provider: "slack", name: "Slack", status: "NOT_CONNECTED", isEnabled: false },
      { organizationId: organization.id, provider: "webhooks", name: "Webhooks", status: "NOT_CONNECTED", isEnabled: false },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { organizationId: organization.id, userId: partner.id, title: "Lead submitted", message: "Brooks Capital Group is awaiting review.", type: NotificationType.LEAD_UPDATE, linkUrl: `/app/leads/${leads[0].id}` },
      { organizationId: organization.id, userId: orgAdmin.id, title: "New lead", message: "Avery Cole submitted Brooks Capital Group.", type: NotificationType.LEAD_UPDATE, linkUrl: `/admin/leads/${leads[0].id}` },
      { organizationId: organization.id, userId: partner.id, title: "Community reply", message: "Ivy replied to a funding question.", type: NotificationType.COMMUNITY, linkUrl: `/app/community/post/${posts[2].id}` },
      { organizationId: organization.id, userId: partner.id, title: "Course in progress", message: "Continue Partner Funding Readiness.", type: NotificationType.TRAINING, linkUrl: "/app/learning" },
    ],
  });

  await prisma.activityLog.createMany({
    data: [
      { organizationId: organization.id, userId: superAdmin.id, action: "seed.platform.ready", entityType: "organization", entityId: organization.id, metadata: { description: "Pohuntoon v1.0 demo workspace prepared" } },
      { organizationId: organization.id, userId: orgAdmin.id, action: "admin.user.invited", entityType: "user", entityId: partner.id, metadata: { description: "Morgan invited Avery as a partner" } },
      { organizationId: organization.id, userId: partner.id, action: "lead.submitted", entityType: "lead", entityId: leads[0].id, metadata: { description: "Avery submitted Brooks Capital Group" } },
      { organizationId: organization.id, userId: orgAdmin.id, action: "resource.uploaded", entityType: "resource", entityId: organization.id, metadata: { description: "Morgan uploaded partner enablement resources" } },
      { organizationId: organization.id, userId: partner.id, action: "community.post.created", entityType: "community_post", entityId: posts[1].id, metadata: { description: "Avery shared a partner win" } },
    ],
  });

  console.log("Pohuntoon demo seed complete", {
    organization: organization.slug,
    users: [superAdmin.email, orgAdmin.email, partnerManager.email, partner.email, viewer.email],
    course: course.slug,
    leads: leads.length,
    posts: posts.length,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
