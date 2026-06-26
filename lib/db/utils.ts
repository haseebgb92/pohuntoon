export function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function withOrganizationScope<T extends Record<string, unknown>>(
  organizationId: string,
  where: T,
) {
  return {
    organizationId,
    ...where,
  };
}
