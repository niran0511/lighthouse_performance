/**
 * Simple logging utility for consistent server-side logging
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${message}`, isDevelopment ? meta : '');
  },

  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, isDevelopment ? meta : '');
  },

  error: (message, error = null) => {
    console.error(`[ERROR] ${message}`, error?.message || '');
    if (isDevelopment && error?.stack) {
      console.error(error.stack);
    }
  },

  scan: (message, scanId) => {
    console.log(`[SCAN] ${scanId} - ${message}`);
  },
};
