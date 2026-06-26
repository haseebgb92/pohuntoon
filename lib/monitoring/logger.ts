type LogContext = Record<string, string | number | boolean | null | undefined>;

type LogLevel = "debug" | "info" | "warn" | "error";

function shouldLog(level: LogLevel) {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return level !== "debug";
}

function sanitizeContext(context?: LogContext) {
  if (!context) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(context).filter(([key]) => !/token|secret|password|key/i.test(key)),
  );
}

function write(level: LogLevel, message: string, context?: LogContext) {
  if (!shouldLog(level)) {
    return;
  }

  const payload = { level, message, context: sanitizeContext(context), timestamp: new Date().toISOString() };

  if (level === "error") {
    console.error(JSON.stringify(payload));
  } else if (level === "warn") {
    console.warn(JSON.stringify(payload));
  } else {
    console.log(JSON.stringify(payload));
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => write("debug", message, context),
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, error?: unknown, context?: LogContext) => {
    const errorContext = error instanceof Error ? { errorName: error.name, errorMessage: error.message } : {};
    write("error", message, { ...context, ...errorContext });
  },
};
