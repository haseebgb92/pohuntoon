export const communityTypeLabels = {
  ANNOUNCEMENT: "Announcement",
  QUESTION: "Question",
  DISCUSSION: "Discussion",
  WIN: "Win",
  RESOURCE_SHARE: "Resource Share",
} as const;

export const communityVisibilityLabels = {
  PUBLIC: "Public within organization",
  PRIVATE: "Private",
  ADMIN_ONLY: "Admin only",
} as const;

export const reactionLabels = {
  LIKE: "Like",
  CELEBRATE: "Celebrate",
  HELPFUL: "Helpful",
  IDEA: "Idea",
} as const;

export const reactionIcons = {
  LIKE: "👍",
  CELEBRATE: "🎉",
  HELPFUL: "✅",
  IDEA: "💡",
} as const;

export const defaultCommunitySpaces = [
  {
    name: "Announcements",
    slug: "announcements",
    description: "Official updates, launches, and important platform news.",
    icon: "Megaphone",
    color: "#6E4BD8",
    visibility: "PUBLIC" as const,
  },
  {
    name: "Funding Questions",
    slug: "funding-questions",
    description: "Ask questions about funding scenarios, documents, and lead readiness.",
    icon: "CircleHelp",
    color: "#29B7E5",
    visibility: "PUBLIC" as const,
  },
  {
    name: "Sales Training",
    slug: "sales-training",
    description: "Discuss training content, scripts, objections, and partner enablement.",
    icon: "GraduationCap",
    color: "#1E4E9A",
    visibility: "PUBLIC" as const,
  },
  {
    name: "Partner Wins",
    slug: "partner-wins",
    description: "Celebrate funded deals, milestones, and partner progress.",
    icon: "Trophy",
    color: "#2CBF6D",
    visibility: "PUBLIC" as const,
  },
  {
    name: "General Discussion",
    slug: "general-discussion",
    description: "Open collaboration for ideas, updates, and peer-to-peer learning.",
    icon: "MessagesSquare",
    color: "#F5A623",
    visibility: "PUBLIC" as const,
  },
  {
    name: "Support",
    slug: "support",
    description: "Get help with platform workflows and partner operations.",
    icon: "LifeBuoy",
    color: "#29B7E5",
    visibility: "PUBLIC" as const,
  },
];
