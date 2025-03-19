/**
 * Create a logger instance to be used across the app.
 *
 * Never create a pino instance yourself, always use the logger created here. This ensures that we log consistently
 * across the application, with consideration to our logging provider Mezmo.
 */
import type { Level } from "pino";
import pino from "pino";
import isString from "lodash/isString";
import type { NotifiableError } from "@bugsnag/core/types/common";
import Bugsnag from "@bugsnag/js";

interface MezmoFormattedObject extends Record<string, unknown> {
  req?: RequestDetails;
  err?: Error;
}

interface MezmoFormattedErrorObject extends Record<string, unknown> {
  req?: RequestDetails;
  err: Error;
}

/**
 * These are the only signatures that we accept using pino. this ensures that the logs are consistent and searchable
 */
interface LogFn {
  (msg: string): void;

  (obj: MezmoFormattedObject, msg: string): void;
}

interface LogFnError {
  (msg: string): void;

  (obj: MezmoFormattedErrorObject, msg: string): void;
}

/**
 * The exposed interface used to enforce logging style
 */
interface Logger {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFnError;
}

interface RequestDetails {
  httpMethod?: string;
  referer?: string;
  url?: string;
  responseCode?: number;
  responseHeaders?: Headers;
  body?: string;
}

/**
 * wrap the pino level in our own in case we ever switch loggers
 */
type LogLevel = Level;

/**
 * Minimal options that we allow for the configuration of the logger
 */
interface LoggerOptions {
  level: LogLevel;
  bugsnagApiKey?: string;
  bugsnagReleaseStage?: string;
  formatters: any;
}

/**
 * wrap the pino logger to handle the override and enable us to destructure it since pino methods are not enumerable
 */
function getWrappedPinoLogger(config: LoggerOptions): Logger {
  const pinoLogger = pino({ ...config });
  return {
    debug(errorOrMsg: string | MezmoFormattedObject, msg?: string): void {
      isString(errorOrMsg)
        ? pinoLogger.debug(errorOrMsg)
        : pinoLogger.debug(errorOrMsg, msg);
    },
    info(errorOrMsg: string | MezmoFormattedObject, msg?: string): void {
      isString(errorOrMsg)
        ? pinoLogger.info(errorOrMsg)
        : pinoLogger.info(errorOrMsg, msg);
    },
    warn(errorOrMsg: string | MezmoFormattedObject, msg?: string): void {
      isString(errorOrMsg)
        ? pinoLogger.warn(errorOrMsg)
        : pinoLogger.warn(errorOrMsg, msg);
    },
    error(errorOrMsg: string | MezmoFormattedErrorObject, msg?: string): void {
      isString(errorOrMsg)
        ? pinoLogger.error(errorOrMsg)
        : pinoLogger.error(errorOrMsg, msg);
    },
  };
}

function initLogger(config: LoggerOptions): Logger {
  if (config.bugsnagApiKey) {
    Bugsnag.start({
      apiKey: config.bugsnagApiKey,
      releaseStage: config.bugsnagReleaseStage,
    });
  }

  // Bugnsag severity levels
  // - error is an unhandled exception, which isn't sent via logger
  // - warning is a handled exception that is sent via logger.error
  // - info is handled but less important, via logger.warn
  type BugsnagSeverity = "error" | "warning" | "info";

  /**
   * wrap bugsnag in logic to ensure that it doesn't fire if not initialised.
   */
  const bugsnagNotify = (
    errorOrMsg: NotifiableError,
    severity: BugsnagSeverity,
    req?: RequestDetails,
  ) => {
    if (config.bugsnagApiKey) {
      Bugsnag.notify(errorOrMsg, function (event: any) {
        event.severity = severity;
        if (req) {
          event.request.url = req.url;
          event.request.httpMethod = req.httpMethod;
          event.request.referer = req.referer;
          event.request.responseCode = req.responseCode;

          if (req.responseHeaders) {
            const result: { [key: string]: string } = {};
            req.responseHeaders.forEach((value, key) => {
              result[key] = value;
            });
            event.request.headers = result;
          }
        }
      });
    }
  };

  const pinoLogger = getWrappedPinoLogger(config);

  return {
    ...pinoLogger,
    /**
     * log via pino AND report to bugsnag
     */
    error(errorOrMsg: string | MezmoFormattedErrorObject, msg?: string): void {
      if (isString(errorOrMsg)) {
        bugsnagNotify(errorOrMsg as string, "warning");
        pinoLogger.error(errorOrMsg as string);
      } else {
        const errorObject = errorOrMsg as MezmoFormattedErrorObject;
        bugsnagNotify(errorObject.err, "warning", errorObject.req);
        pinoLogger.error(errorOrMsg as MezmoFormattedErrorObject, msg ?? "");
      }
    },
    warn(errorOrMsg: string | MezmoFormattedObject, msg?: string): void {
      if (isString(errorOrMsg)) {
        bugsnagNotify(errorOrMsg as string, "info");
        pinoLogger.warn(errorOrMsg as string);
      } else {
        const errorObject = errorOrMsg as MezmoFormattedErrorObject;
        bugsnagNotify(errorObject.err || msg, "info", errorObject.req);
        pinoLogger.warn(errorOrMsg as MezmoFormattedErrorObject, msg ?? "");
      }
    },
  };
}

const logger = initLogger({
  level: (process.env.LOG_LEVEL as LogLevel) || "info",
  bugsnagApiKey: process.env.BUGSNAG_API_KEY,
  bugsnagReleaseStage: process.env.BUGSNAG_RELEASE_STAGE,
  formatters: {
    level(label: string, number: number) {
      return { level: label.toUpperCase() };
    },
  },
});

export default logger;
