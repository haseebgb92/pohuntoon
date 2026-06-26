import { hasPermission } from "@/lib/auth/permissions";
import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";

function createUser(
  role: AuthenticatedAppUser["role"],
): AuthenticatedAppUser {
  return {
    id: "user_1",
    email: "user@example.com",
    name: "User Example",
    role,
    status: "ACTIVE",
    organizationId: "org_1",
    organizationName: "Northstar Partners",
    avatarUrl: null,
    lastLoginAt: null,
    supabaseUserId: "supabase_1",
  };
}

describe("permissions", () => {
  it("grants admin-level permissions to org admins", () => {
    const user = createUser("ORG_ADMIN");

    expect(hasPermission(user, "manage_users")).toBe(true);
    expect(hasPermission(user, "manage_settings")).toBe(true);
    expect(hasPermission(user, "manage_leads")).toBe(true);
  });

  it("limits partner permissions appropriately", () => {
    const user = createUser("PARTNER");

    expect(hasPermission(user, "view_learning")).toBe(true);
    expect(hasPermission(user, "submit_leads")).toBe(true);
    expect(hasPermission(user, "manage_users")).toBe(false);
    expect(hasPermission(user, "manage_settings")).toBe(false);
  });

  it("keeps viewer access read-focused", () => {
    const user = createUser("VIEWER");

    expect(hasPermission(user, "view_dashboard")).toBe(true);
    expect(hasPermission(user, "view_resources")).toBe(true);
    expect(hasPermission(user, "submit_leads")).toBe(false);
    expect(hasPermission(user, "manage_courses")).toBe(false);
  });
});
