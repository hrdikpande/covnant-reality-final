/**
 * Location utility functions for root-word extraction and corruption detection.
 * Used across frontend components and search logic.
 */

/**
 * Extracts the root word from a location string for fuzzy matching.
 *
 * Examples:
 *   "Medchal, Hyderabad"  → "medchal"
 *   "Medchal-Malkajgiri"  → "medchal"
 *   "  Medchal Road "     → "medchal"
 *   "Banjara Hills"       → "banjara"
 *   "Kukatpally"          → "kukatpally"
 */
export function extractLocationRoot(location: string): string {
    if (!location) return "";
    // Step 1: Split by comma → take first part
    let root = location.split(",")[0];
    // Step 2: Split by hyphen → take first part
    root = root.split("-")[0];
    // Step 3: Split by space → take first word (to handle "Medchal Road" → "Medchal")
    root = root.trim().split(/\s+/)[0];
    // Step 4: Trim whitespace + lowercase for comparison
    root = root.trim().toLowerCase();
    return root;
}

/**
 * Checks if a locality/address string looks like corrupted data
 * (price codes, usernames, etc.) rather than a real address.
 *
 * Known corrupted patterns from the database:
 *   "shar70k", "pra1.10lak", "srini33k", "9.5lak", etc.
 *
 * Real addresses typically:
 *   - Have spaces (multi-word)
 *   - Are longer (>= 4 chars)
 *   - Don't mix letters+digits in a single short token
 */
export function isCorruptedLocation(value: string | null | undefined): boolean {
    if (!value || !value.trim()) return true;
    const v = value.trim();

    // Too short to be a real location
    if (v.length < 3) return true;

    // Looks like a price code: digits followed by k/lak/lac/cr suffix
    // e.g. "70k", "1.10lak", "9.5lak", "33k", "2.5cr"
    if (/^\d+(\.\d+)?\s*(k|lak|lac|cr)\s*$/i.test(v)) return true;

    // Looks like a username/code: letters+digits jammed together with no spaces
    // e.g. "shar70k", "pra1.10lak", "srini33k"
    if (!/\s/.test(v) && /[a-zA-Z]/.test(v) && /\d/.test(v)) {
        // But allow things like "Sector-9" or "Phase2" which have a clear pattern
        // Check if it ends with a price suffix
        if (/\d+(\.\d+)?\s*(k|lak|lac|cr)\s*$/i.test(v)) return true;
        // Check if it looks like a username (letters then digits or vice-versa, short)
        if (v.length < 15 && /^[a-zA-Z]+\d/.test(v)) return true;
    }

    return false;
}
