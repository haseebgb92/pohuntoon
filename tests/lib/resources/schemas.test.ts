import {
  resourceCreateSchema,
  resourceEditSchema,
} from "@/lib/resources/schemas";

describe("resource schemas", () => {
  it("accepts a file-backed resource payload", () => {
    const result = resourceCreateSchema.safeParse({
      title: "Partner Pitch Deck",
      description: "Latest deck",
      category: "Sales Enablement",
      version: "1.0",
      fileType: "application/pdf",
      resourceKind: "FILE",
      fileUrl: "resources/org/resource.pdf",
      externalUrl: "",
      originalFileName: "partner-pitch-deck.pdf",
    });

    expect(result.success).toBe(true);
  });

  it("accepts an external-link resource payload", () => {
    const result = resourceCreateSchema.safeParse({
      title: "Knowledge Base",
      description: "External docs",
      category: "Documentation",
      version: "Current",
      fileType: "external-link",
      resourceKind: "EXTERNAL_LINK",
      fileUrl: "https://docs.example.com/partners",
      externalUrl: "https://docs.example.com/partners",
      originalFileName: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects file resources without a stored file path", () => {
    const result = resourceCreateSchema.safeParse({
      title: "Partner Pitch Deck",
      description: "",
      category: "Sales Enablement",
      version: "1.0",
      fileType: "application/pdf",
      resourceKind: "FILE",
      fileUrl: "",
      externalUrl: "",
      originalFileName: "partner-pitch-deck.pdf",
    });

    expect(result.success).toBe(false);
  });

  it("rejects external links without a valid URL", () => {
    const result = resourceEditSchema.safeParse({
      title: "Knowledge Base",
      description: "",
      category: "Documentation",
      version: "Current",
      fileType: "external-link",
      resourceKind: "EXTERNAL_LINK",
      fileUrl: "",
      externalUrl: "not-a-url",
      originalFileName: "",
      status: "ACTIVE",
    });

    expect(result.success).toBe(false);
  });
});
