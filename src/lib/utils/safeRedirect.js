/**
 * safeRedirect — validates a redirect URL is a safe same-origin relative path.
 *
 * Rejects:
 *  - javascript: schemes
 *  - protocol-relative URLs (//)
 *  - absolute URLs with a scheme (http:, https:, etc.)
 *  - empty strings or anything that doesn't start with a single /
 *
 * @param {string|null} url
 * @param {string} fallback
 * @returns {string}
 */
export function safeRedirect(url, fallback = "/dashboard") {
  if (!url || typeof url !== "string") return fallback;

  const trimmed = url.trim();

  // Must start with exactly one slash (relative path)
  if (!trimmed.startsWith("/")) return fallback;

  // Reject protocol-relative URLs like //evil.com
  if (trimmed.startsWith("//")) return fallback;

  // Reject any URL containing a scheme (javascript:, http:, data:, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/i.test(trimmed.replace(/^\//, ""))) return fallback;

  return trimmed;
}
