import { env } from "./env";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = env.NODE_ENV === "development";
  private isProduction = env.NODE_ENV === "production";

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case "debug":
        // Only log debug in development
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
      case "info":
        // Log info in both environments, but formatted differently
        if (this.isDevelopment) {
          console.info(formattedMessage);
        } else {
          // In production, use console.log for info (more structured)
          console.log(formattedMessage);
        }
        break;
      case "warn":
        // Always log warnings
        console.warn(formattedMessage);
        break;
      case "error":
        // Always log errors, with full stack trace in development
        console.error(formattedMessage);
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      ...(error instanceof Error
        ? {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          }
        : { error }),
    };
    this.log("error", message, errorContext);
  }
}

export const logger = new Logger();

