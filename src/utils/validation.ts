/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitizes a search query by:
 * - Trimming whitespace
 * - Limiting length
 * - Removing potentially dangerous characters
 * @param query - The search query to sanitize
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized query string
 */
export function sanitizeSearchQuery(query: string, maxLength: number = 100): string {
  if (typeof query !== "string") {
    return ""
  }

  return query
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
}

/**
 * Validates a search query
 * @param query - The search query to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validateSearchQuery(query: string): { isValid: boolean; error?: string } {
  if (typeof query !== "string") {
    return { isValid: false, error: "Search query must be a string" }
  }

  if (query.length > 100) {
    return { isValid: false, error: "Search query is too long (max 100 characters)" }
  }

  // Check for potentially malicious patterns
  if (/<script|javascript:|on\w+\s*=/i.test(query)) {
    return { isValid: false, error: "Invalid characters in search query" }
  }

  return { isValid: true }
}

/**
 * Sanitizes a numeric input (for price filters)
 * @param value - The value to sanitize
 * @returns Sanitized number or null if invalid
 */
export function sanitizeNumericInput(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(numValue) || !isFinite(numValue)) {
    return null
  }

  // Ensure non-negative and reasonable range
  if (numValue < 0 || numValue > Number.MAX_SAFE_INTEGER) {
    return null
  }

  return Math.round(numValue * 100) / 100 // Round to 2 decimal places
}

/**
 * Validates price range
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Object with isValid flag and error message if invalid
 */
export function validatePriceRange(
  min: number | null,
  max: number | null,
): { isValid: boolean; error?: string } {
  if (min !== null && min < 0) {
    return { isValid: false, error: "Minimum price cannot be negative" }
  }

  if (max !== null && max < 0) {
    return { isValid: false, error: "Maximum price cannot be negative" }
  }

  if (min !== null && max !== null && min > max) {
    return { isValid: false, error: "Minimum price cannot be greater than maximum price" }
  }

  return { isValid: true }
}
