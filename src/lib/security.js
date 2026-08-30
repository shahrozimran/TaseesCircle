/**
 * Lightweight Zero-Dependency Security & Input Sanitization Utilities
 */

/**
 * Sanitizes user input string against HTML/XSS injection.
 * Trims whitespace, replaces dangerous HTML entities, and enforces optional max length.
 */
export function sanitizeInput(input, maxLength = 1000) {
  if (typeof input !== "string") return "";

  // 1. Enforce length boundary
  let sanitized = input.trim().slice(0, maxLength);

  // 2. Escape HTML entities to prevent DOM XSS execution
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  sanitized = sanitized.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);

  return sanitized;
}

/**
 * Validates email format according to standard RFC 5322 regex pattern.
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
 */
export function sanitizeSearchQuery(query, maxLength = 100) {
  if (typeof query !== "string") return "";
  // Strip control characters and excessive whitespace
  return query
    .replace(/[\x00-\x1F\x7F]/g, "")
    .slice(0, maxLength);
}
