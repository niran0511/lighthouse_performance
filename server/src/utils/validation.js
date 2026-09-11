/**
 * Common validation utilities
 */

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 
    && /[A-Z]/.test(password) 
    && /[a-z]/.test(password) 
    && /[0-9]/.test(password);
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 1000);
}

export function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function validatePaginationParams(limit, offset) {
  const validLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const validOffset = Math.max(Number(offset) || 0, 0);
  return { limit: validLimit, offset: validOffset };
}
