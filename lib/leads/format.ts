export function formatLeadCurrency(value: string | number | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : value;

  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return "Not provided";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLeadDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

export function formatLeadDateTime(value: Date | string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
