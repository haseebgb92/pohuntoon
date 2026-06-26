import { createSlug, withOrganizationScope } from "@/lib/db/utils";

describe("db utils", () => {
  it("creates stable slugs from human-readable labels", () => {
    expect(createSlug("Northstar Partners")).toBe("northstar-partners");
    expect(createSlug("  Partner   Enablement 101  ")).toBe("partner-enablement-101");
  });

  it("adds organization scope to a where object", () => {
    expect(withOrganizationScope("org_123", { status: "ACTIVE" })).toEqual({
      organizationId: "org_123",
      status: "ACTIVE",
    });
  });
});
