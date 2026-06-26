import { getNavigationForArea } from "@/lib/config/navigation";

describe("navigation", () => {
  it("returns only partner items for partner users", () => {
    const items = getNavigationForArea("partner", "PARTNER");

    expect(items.map((item) => item.label)).toEqual([
      "Home",
      "Learn",
      "Resources",
      "Leads",
      "Community",
      "Notifications",
      "Settings",
      "Profile",
    ]);
    expect(items.map((item) => item.href)).toEqual([
      "/app/dashboard",
      "/app/learning",
      "/app/resources",
      "/app/leads",
      "/app/community",
      "/app/notifications",
      "/app/settings",
      "/app/profile",
    ]);
  });

  it("keeps the partner mobile sequence stable", () => {
    const items = getNavigationForArea("partner", "PARTNER");

    expect(items.map((item) => item.label)).toEqual([
      "Home",
      "Learn",
      "Resources",
      "Leads",
      "Community",
      "Notifications",
      "Settings",
      "Profile",
    ]);
  });

  it("returns only admin items for admin users", () => {
    const items = getNavigationForArea("admin", "ORG_ADMIN");

    expect(items.map((item) => item.label)).toEqual([
      "Admin Dashboard",
      "Users",
      "Partners",
      "Organizations",
      "Organization",
      "Roles",
      "Audit",
      "Integrations",
      "Courses",
      "Resources",
      "Leads",
      "Notifications",
      "Community",
      "Settings",
    ]);
  });
});
