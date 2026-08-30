/**
 * In-Memory Sliding Window Rate Limiter for Next.js App Router
 * Tracks request counts per client IP within a configurable time window.
 */

const rateLimitMap = new Map();

/**
 * Evaluates whether an IP address has exceeded the rate limit.
 * @param {string} ip - Client IP address
 * @param {number} limit - Maximum allowed requests in the time window
 * @param {number} windowMs - Time window in milliseconds (e.g. 15 * 60 * 1000 = 15 mins)
 * @returns {{ success: boolean, remaining: number, resetSeconds: number }}
 */
export function checkRateLimit(ip, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const cleanIp = ip || "anonymous";

  // Cleanup old entries every 50 requests to prevent memory leaks
  if (rateLimitMap.size > 1000) {
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  let record = rateLimitMap.get(cleanIp);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(cleanIp, record);
    return {
      success: true,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds: resetSeconds > 0 ? resetSeconds : 1,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetSeconds: Math.ceil((record.resetTime - now) / 1000),
  };
}
