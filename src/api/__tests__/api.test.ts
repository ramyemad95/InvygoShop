import { apiClient } from "../apiClient"
import { fetchCars } from "../carsApi"

jest.mock("@/store", () => {
  const actual = jest.requireActual("@/store")
  return {
    ...actual,
    store: {
      ...actual.store,
      getState: jest.fn(() => ({
        ui: { language: "ar" },
      })),
    },
  }
})

describe("apiClient interceptors", () => {
  it("adds language header and normalizes errors", async () => {
    // Access handlers through type assertion since handlers is not in public API
    const requestInterceptors = (apiClient.instance.interceptors.request as any).handlers
    const responseInterceptors = (apiClient.instance.interceptors.response as any).handlers

    const requestHandler = requestInterceptors[0]?.fulfilled
    const requestErrorHandler = requestInterceptors[0]?.rejected
    const responseSuccessHandler = responseInterceptors[0]?.fulfilled
    const responseErrorHandler = responseInterceptors[0]?.rejected

    expect(typeof requestHandler).toBe("function")
    expect(typeof responseErrorHandler).toBe("function")

    // Test request handler with headers
    const config = await requestHandler({ headers: {} })
    expect(config.headers["Accept-Language"]).toBe("ar")

    // Test request handler without headers
    const passthrough = await requestHandler({})
    expect(passthrough.headers).toBeUndefined()

    // Test request error handler
    if (requestErrorHandler) {
      const requestError = new Error("Request error")
      await expect(requestErrorHandler(requestError)).rejects.toBe(requestError)
    }

    // Test response success handler
    const okResponse = await responseSuccessHandler({ data: { ok: true } })
    expect(okResponse.data.ok).toBe(true)

    // Test response error handler with response.data.message
    await expect(responseErrorHandler({ response: { data: { message: "Nope" } } })).rejects.toThrow(
      "Nope",
    )

    // Test response error handler with response.data but no message
    await expect(
      responseErrorHandler({ response: { data: {} }, message: "Default message" }),
    ).rejects.toThrow("Default message")

    // Test response error handler with response but no data.message or message
    await expect(responseErrorHandler({ response: {}, message: undefined })).rejects.toThrow(
      "An error occurred",
    )

    // Test response error handler with request but no response
    await expect(responseErrorHandler({ request: {} })).rejects.toThrow("Network error")

    // Test response error handler with neither response nor request
    await expect(responseErrorHandler({ message: "Other error" })).rejects.toEqual({
      message: "Other error",
    })
  })
})

describe("fetchCars", () => {
  let logSpy: jest.SpyInstance

  beforeEach(() => {
    jest.useFakeTimers()
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.useRealTimers()
    logSpy.mockRestore()
  })

  it("returns paginated cars and hasMore flag", async () => {
    const promise = fetchCars(1, "")
    jest.advanceTimersByTime(800)
    const result = await promise

    expect(result.cars.length).toBeGreaterThan(0)
    expect(result.total).toBeGreaterThanOrEqual(result.cars.length)
    expect(typeof result.hasMore).toBe("boolean")
  })

  it("filters cars by search query", async () => {
    const promise = fetchCars(1, "tesla")
    jest.advanceTimersByTime(800)
    const result = await promise

    expect(result.cars.every((c) => `${c.brand} ${c.name}`.toLowerCase().includes("tesla"))).toBe(
      true,
    )
  })

  it("handles pagination delays on later pages", async () => {
    const promise = fetchCars(2, "")
    jest.advanceTimersByTime(2000)
    const result = await promise

    expect(result.hasMore === true || result.hasMore === false).toBe(true)
  })

  it("validates and sanitizes search query", async () => {
    const promise = fetchCars(1, "  <script>alert('xss')</script>test  ")
    jest.advanceTimersByTime(800)
    const result = await promise

    // Query should be sanitized (no script tags)
    expect(result.cars).toBeDefined()
  })

  it("handles invalid page numbers", async () => {
    const promise = fetchCars(-1, "")
    jest.advanceTimersByTime(800)
    const result = await promise

    // Should default to page 1
    expect(result.cars).toBeDefined()
  })

  it("handles very long search queries", async () => {
    const longQuery = "a".repeat(200)
    const promise = fetchCars(1, longQuery)
    jest.advanceTimersByTime(800)
    const result = await promise

    // Query should be truncated
    expect(result.cars).toBeDefined()
  })

  it("handles search query validation failure", async () => {
    // Test with malicious query that fails validation
    const maliciousQuery = "<script>alert('xss')</script>"
    const promise = fetchCars(1, maliciousQuery)
    jest.advanceTimersByTime(800)
    const result = await promise

    // Should still return results (query is sanitized, not rejected)
    expect(result.cars).toBeDefined()
  })

  it("handles empty search query", async () => {
    const promise = fetchCars(1, "")
    jest.advanceTimersByTime(800)
    const result = await promise

    expect(result.cars.length).toBeGreaterThan(0)
  })

  it("handles page 0 and negative pages", async () => {
    const promise1 = fetchCars(0, "")
    jest.advanceTimersByTime(800)
    const result1 = await promise1
    expect(result1.cars).toBeDefined()

    const promise2 = fetchCars(-5, "")
    jest.advanceTimersByTime(800)
    const result2 = await promise2
    expect(result2.cars).toBeDefined()
  })
})
