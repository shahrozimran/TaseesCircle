/**
 * Lightweight Zero-Dependency Security & Input Utilities
 *
 * IMPORTANT (M-08): Store RAW normalised text in the database.
 * Apply escapeHtml() only at the output sink (e.g. HTML email templates).
 * The old sanitizeInput() was HTML-escaping before persistence which caused
 * double-escaping and data corruption.
 */

/**
 * Normalises a user input string for safe database storage.
 * Only trims whitespace and enforces max length — does NOT HTML-encode.
 * HTML encoding must happen at the output sink via escapeHtml().
 *
 * @param {string} input
 * @param {number} maxLength
 * @returns {string}
 */
export function normaliseInput(input, maxLength = 1000) {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

/**
 * @deprecated Use normaliseInput() instead.
 * Kept for backward compatibility — now delegates to normaliseInput
 * so existing callers continue to work without HTML-encoding side effects.
 */
export function sanitizeInput(input, maxLength = 1000) {
  return normaliseInput(input, maxLength);
}

/**
 * Escapes HTML special characters for safe interpolation into HTML templates.
 * Use this at every HTML output sink (e.g. email templates, dangerouslySetInnerHTML).
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates email format according to standard RFC 5322 regex pattern.
 *
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (typeof email !== "string") return false;
  const cleaned = email.trim();
  if (cleaned.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleaned);
}

/**
 * Sanitizes search query string for safe state usage.
 *
 * @param {string} query
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeSearchQuery(query, maxLength = 100) {
  if (typeof query !== "string") return "";
  return query
    .replace(/[\x00-\x1F\x7F]/g, "")
    .slice(0, maxLength);
}
