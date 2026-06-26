import { z } from "zod";

const baseResourceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().default(""),
  category: z.string().trim().min(2).max(80),
  version: z.string().trim().min(1).max(40).optional().default(""),
  fileType: z.string().trim().min(1).max(120),
  resourceKind: z.enum(["FILE", "EXTERNAL_LINK"]),
  fileUrl: z.string().trim().optional().default(""),
  externalUrl: z.string().trim().optional().default(""),
  originalFileName: z.string().trim().optional().default(""),
});

function applyResourceModeRules(
  value: z.infer<typeof baseResourceSchema>,
  ctx: z.RefinementCtx,
) {
  if (value.resourceKind === "FILE" && !value.fileUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["fileUrl"],
      message: "A stored file path is required for file resources.",
    });
  }

  if (value.resourceKind === "EXTERNAL_LINK") {
    const urlResult = z.string().url().safeParse(value.externalUrl);

    if (!urlResult.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["externalUrl"],
        message: "A valid external URL is required.",
      });
    }
  }
}

export const resourceCreateSchema = baseResourceSchema.superRefine(applyResourceModeRules);

export const resourceEditSchema = baseResourceSchema
  .extend({
  status: z.enum(["ACTIVE", "ARCHIVED"]),
  })
  .superRefine(applyResourceModeRules);

export const resourceFilterSchema = z.object({
  query: z.string().trim().optional().default(""),
  category: z.string().trim().optional().default("all"),
  fileType: z.string().trim().optional().default("all"),
  view: z.enum(["grid", "list"]).optional().default("grid"),
});

export type ResourceCreateInput = z.infer<typeof resourceCreateSchema>;
export type ResourceEditInput = z.infer<typeof resourceEditSchema>;
export type ResourceFilterInput = z.infer<typeof resourceFilterSchema>;
