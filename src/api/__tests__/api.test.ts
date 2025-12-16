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
    const requestHandler = apiClient.instance.interceptors.request.handlers[0]?.fulfilled
    const responseSuccessHandler = apiClient.instance.interceptors.response.handlers[0]?.fulfilled
    const responseErrorHandler = apiClient.instance.interceptors.response.handlers[0]?.rejected

    expect(typeof requestHandler).toBe("function")
    expect(typeof responseErrorHandler).toBe("function")

    const config = await requestHandler({ headers: {} })
    expect(config.headers["Accept-Language"]).toBe("ar")

    const passthrough = await requestHandler({})
    expect(passthrough.headers).toBeUndefined()

    const okResponse = await responseSuccessHandler({ data: { ok: true } })
    expect(okResponse.data.ok).toBe(true)

    await expect(responseErrorHandler({ response: { data: { message: "Nope" } } })).rejects.toThrow(
      "Nope",
    )

    await expect(responseErrorHandler({ message: "Other error" })).rejects.toEqual({
      message: "Other error",
    })
    await expect(responseErrorHandler({ request: {} })).rejects.toThrow("Network error")
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
})
