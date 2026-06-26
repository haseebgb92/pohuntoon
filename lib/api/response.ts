import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/lib/monitoring/logger";

export type ApiErrorCode = "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "RATE_LIMITED" | "SERVER_ERROR";

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function apiError(message: string, status = 400, code: ApiErrorCode = "BAD_REQUEST") {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

export function handleApiError(error: unknown, fallback: string, context?: Record<string, string>) {
  if (error instanceof ZodError) {
    return apiError(error.issues[0]?.message || fallback, 422, "BAD_REQUEST");
  }

  logger.error(fallback, error, context);

  if (error instanceof Error && error.message) {
    return apiError(error.message, 400, "BAD_REQUEST");
  }

  return apiError(fallback, 500, "SERVER_ERROR");
}
