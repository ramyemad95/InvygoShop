import { ErrorType, reportCrash } from "../crashReporting"

describe("crashReporting", () => {
  const originalDev = (global as any).__DEV__
  let errorSpy: jest.SpyInstance
  let logSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    ;(global as any).__DEV__ = originalDev
    errorSpy.mockRestore()
    logSpy.mockRestore()
  })

  it("logs errors when in dev mode", () => {
    ;(global as any).__DEV__ = true
    reportCrash(new Error("boom"), ErrorType.HANDLED)
    expect(errorSpy).toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith("boom", ErrorType.HANDLED)
  })

  it("silently ignores in production mode", () => {
    ;(global as any).__DEV__ = false
    expect(() => reportCrash(new Error("prod"))).not.toThrow()
  })
})

