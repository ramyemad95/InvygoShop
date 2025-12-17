import {
  sanitizeSearchQuery,
  validateSearchQuery,
  sanitizeNumericInput,
  validatePriceRange,
} from "../validation"

describe("validation utilities", () => {
  describe("sanitizeSearchQuery", () => {
    it("should return empty string for non-string input", () => {
      expect(sanitizeSearchQuery(null as any)).toBe("")
      expect(sanitizeSearchQuery(undefined as any)).toBe("")
      expect(sanitizeSearchQuery(123 as any)).toBe("")
    })

    it("should trim whitespace", () => {
      expect(sanitizeSearchQuery("  hello  ")).toBe("hello")
      expect(sanitizeSearchQuery("\t\nworld\t\n")).toBe("world")
    })

    it("should limit length to maxLength", () => {
      const longQuery = "a".repeat(150)
      expect(sanitizeSearchQuery(longQuery, 100).length).toBe(100)
      expect(sanitizeSearchQuery(longQuery, 50).length).toBe(50)
    })

    it("should remove HTML tags", () => {
      expect(sanitizeSearchQuery("hello<script>alert('xss')</script>world")).toBe(
        "helloscriptalert('xss')/scriptworld",
      )
      expect(sanitizeSearchQuery("test<tag>content</tag>")).toBe("testtagcontent/tag")
    })

    it("should normalize whitespace", () => {
      expect(sanitizeSearchQuery("hello    world")).toBe("hello world")
      expect(sanitizeSearchQuery("test\t\t\n\nvalue")).toBe("test value")
    })

    it("should handle empty string", () => {
      expect(sanitizeSearchQuery("")).toBe("")
    })

    it("should handle valid query", () => {
      expect(sanitizeSearchQuery("Tesla Model S")).toBe("Tesla Model S")
    })
  })

  describe("validateSearchQuery", () => {
    it("should return invalid for non-string input", () => {
      const result = validateSearchQuery(null as any)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Search query must be a string")
    })

    it("should return invalid for query exceeding max length", () => {
      const longQuery = "a".repeat(101)
      const result = validateSearchQuery(longQuery)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Search query is too long (max 100 characters)")
    })

    it("should return invalid for malicious patterns", () => {
      const maliciousQueries = [
        "<script>alert('xss')</script>",
        "javascript:alert('xss')",
        "onclick=alert('xss')",
        "onerror=alert('xss')",
        "onload=alert('xss')",
      ]

      maliciousQueries.forEach((query) => {
        const result = validateSearchQuery(query)
        expect(result.isValid).toBe(false)
        expect(result.error).toBe("Invalid characters in search query")
      })
    })

    it("should return valid for safe queries", () => {
      const safeQueries = ["Tesla", "Model S", "BMW X5", "hello world", "test123"]

      safeQueries.forEach((query) => {
        const result = validateSearchQuery(query)
        expect(result.isValid).toBe(true)
        expect(result.error).toBeUndefined()
      })
    })

    it("should return valid for empty string", () => {
      const result = validateSearchQuery("")
      expect(result.isValid).toBe(true)
    })

    it("should return valid for query at max length", () => {
      const maxLengthQuery = "a".repeat(100)
      const result = validateSearchQuery(maxLengthQuery)
      expect(result.isValid).toBe(true)
    })
  })

  describe("sanitizeNumericInput", () => {
    it("should return null for null, undefined, or empty string", () => {
      expect(sanitizeNumericInput(null)).toBeNull()
      expect(sanitizeNumericInput(undefined)).toBeNull()
      expect(sanitizeNumericInput("")).toBeNull()
    })

    it("should parse string numbers", () => {
      expect(sanitizeNumericInput("123")).toBe(123)
      expect(sanitizeNumericInput("45.67")).toBe(45.67)
      expect(sanitizeNumericInput("0")).toBe(0)
    })

    it("should return number as-is", () => {
      expect(sanitizeNumericInput(123)).toBe(123)
      expect(sanitizeNumericInput(45.67)).toBe(45.67)
      expect(sanitizeNumericInput(0)).toBe(0)
    })

    it("should return null for invalid numbers", () => {
      expect(sanitizeNumericInput("abc")).toBeNull()
      expect(sanitizeNumericInput("not a number")).toBeNull()
      expect(sanitizeNumericInput("")).toBeNull()
    })

    it("should handle parseFloat edge cases", () => {
      // parseFloat("12.34.56") returns 12.34, so we test actual invalid cases
      expect(sanitizeNumericInput("12.34.56")).toBe(12.34) // parseFloat stops at second decimal
      expect(sanitizeNumericInput("123abc")).toBe(123) // parseFloat extracts leading number
    })

    it("should return null for NaN", () => {
      expect(sanitizeNumericInput(NaN)).toBeNull()
    })

    it("should return null for Infinity", () => {
      expect(sanitizeNumericInput(Infinity)).toBeNull()
      expect(sanitizeNumericInput(-Infinity)).toBeNull()
    })

    it("should return null for negative numbers", () => {
      expect(sanitizeNumericInput(-1)).toBeNull()
      expect(sanitizeNumericInput("-5")).toBeNull()
      expect(sanitizeNumericInput(-0.5)).toBeNull()
    })

    it("should return null for numbers exceeding MAX_SAFE_INTEGER", () => {
      expect(sanitizeNumericInput(Number.MAX_SAFE_INTEGER + 1)).toBeNull()
    })

    it("should round to 2 decimal places", () => {
      expect(sanitizeNumericInput("123.456")).toBe(123.46)
      expect(sanitizeNumericInput("45.999")).toBe(46)
      expect(sanitizeNumericInput("10.001")).toBe(10)
    })

    it("should handle zero", () => {
      expect(sanitizeNumericInput(0)).toBe(0)
      expect(sanitizeNumericInput("0")).toBe(0)
    })

    it("should handle MAX_SAFE_INTEGER", () => {
      expect(sanitizeNumericInput(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
    })
  })

  describe("validatePriceRange", () => {
    it("should return valid for null values", () => {
      const result = validatePriceRange(null, null)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should return invalid for negative min price", () => {
      const result = validatePriceRange(-1, null)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Minimum price cannot be negative")
    })

    it("should return invalid for negative max price", () => {
      const result = validatePriceRange(null, -1)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Maximum price cannot be negative")
    })

    it("should return invalid when min is greater than max", () => {
      const result = validatePriceRange(100, 50)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Minimum price cannot be greater than maximum price")
    })

    it("should return valid when min equals max", () => {
      const result = validatePriceRange(100, 100)
      expect(result.isValid).toBe(true)
    })

    it("should return valid when min is less than max", () => {
      const result = validatePriceRange(50, 100)
      expect(result.isValid).toBe(true)
    })

    it("should return valid for valid min only", () => {
      const result = validatePriceRange(50, null)
      expect(result.isValid).toBe(true)
    })

    it("should return valid for valid max only", () => {
      const result = validatePriceRange(null, 100)
      expect(result.isValid).toBe(true)
    })

    it("should return valid for zero prices", () => {
      expect(validatePriceRange(0, null).isValid).toBe(true)
      expect(validatePriceRange(null, 0).isValid).toBe(true)
      expect(validatePriceRange(0, 0).isValid).toBe(true)
    })
  })
})
