import { canAccessArea, hasRole } from "@/lib/auth/guards";

describe("auth guards", () => {
  it("allows admin roles into the admin area", () => {
    expect(canAccessArea("SUPER_ADMIN", "admin")).toBe(true);
    expect(canAccessArea("ORG_ADMIN", "admin")).toBe(true);
    expect(canAccessArea("PARTNER_MANAGER", "admin")).toBe(true);
  });

  it("blocks partner-only roles from the admin area", () => {
    expect(canAccessArea("PARTNER", "admin")).toBe(false);
    expect(canAccessArea("VIEWER", "admin")).toBe(false);
  });

  it("allows partner area access to all supported roles", () => {
    expect(canAccessArea("PARTNER", "partner")).toBe(true);
    expect(canAccessArea("VIEWER", "partner")).toBe(true);
  });

  it("checks direct role membership safely", () => {
    expect(hasRole("PARTNER", ["PARTNER", "VIEWER"])).toBe(true);
    expect(hasRole(null, ["PARTNER"])).toBe(false);
  });
});
