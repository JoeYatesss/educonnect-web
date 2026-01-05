/**
 * Production-safe logger utility
 *
 * Only logs to console in development mode.
 * Errors are always logged regardless of environment.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log informational messages (development only)
   */
  log: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log warnings (development only)
   */
  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always, in all environments)
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },

  /**
   * Log info messages (development only)
   */
  info: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};

export default logger;
