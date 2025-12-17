/**
 * Logger utility that gates console statements behind __DEV__
 * This prevents console statements from running in production builds
 */

type LogLevel = "log" | "error" | "warn" | "info" | "debug"

interface Logger {
  log: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

const createLogger = (): Logger => {
  if (__DEV__) {
    return {
      log: (...args: unknown[]) => console.log(...args),
      error: (...args: unknown[]) => console.error(...args),
      warn: (...args: unknown[]) => console.warn(...args),
      info: (...args: unknown[]) => console.info(...args),
      debug: (...args: unknown[]) => console.debug(...args),
    }
  }

  // No-op functions for production
  return {
    log: () => {},
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
  }
}

export const logger = createLogger()

