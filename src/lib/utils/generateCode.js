/**
 * Generate a unique 6-character alphanumeric code
 * Format: [A-Z0-9]{6} → e.g., "A7K3X9"
 * This is a client-side helper. The actual uniqueness is enforced
 * by the database constraint on masjids.unique_code
 */
export function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  const array = new Uint8Array(length);
  
  // Use crypto if available (browser or Node)
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }

  for (let i = 0; i < length; i++) {
    code += chars[array[i] % chars.length];
  }

  return code;
}
