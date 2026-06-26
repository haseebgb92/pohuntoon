import { logger } from "@/lib/monitoring/logger";

type MonitoringEvent = {
  name: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

export function captureMonitoringEvent(event: MonitoringEvent) {
  logger.info("monitoring.event", { event: event.name, ...event.properties });
}

export function captureMonitoringError(error: unknown, context?: Record<string, string>) {
  logger.error("monitoring.error", error, context);
}

export const monitoringProviders = [
  "Sentry",
  "OpenTelemetry",
  "Google Analytics",
  "PostHog",
  "Microsoft Clarity",
] as const;
