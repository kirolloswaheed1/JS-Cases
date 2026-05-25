/**
 * Generates a short, human-readable design ID.
 * Format: JS-CASE-{timestamp36}{random4}
 * Example: JS-CASE-LMA92H4XPQ
 */
export function generateDesignId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JS-CASE-${ts}${rnd}`;
}
