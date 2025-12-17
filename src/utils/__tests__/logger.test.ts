// Mock console methods
const mockConsoleLog = jest.fn()
const mockConsoleError = jest.fn()
const mockConsoleWarn = jest.fn()
const mockConsoleInfo = jest.fn()
const mockConsoleDebug = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
  global.console.log = mockConsoleLog
  global.console.error = mockConsoleError
  global.console.warn = mockConsoleWarn
  global.console.info = mockConsoleInfo
  global.console.debug = mockConsoleDebug
})

describe("logger", () => {
  describe("in development mode", () => {
    beforeEach(() => {
      // Ensure __DEV__ is true (default in test environment)
      // @ts-ignore
      global.__DEV__ = true
    })

    it("should call console.log when logger.log is called", () => {
      const { logger: devLogger } = require("../logger")
      devLogger.log("test message", { data: 123 })
      expect(mockConsoleLog).toHaveBeenCalledWith("test message", { data: 123 })
    })

    it("should call console.error when logger.error is called", () => {
      const { logger: devLogger } = require("../logger")
      const error = new Error("test error")
      devLogger.error(error)
      expect(mockConsoleError).toHaveBeenCalledWith(error)
    })

    it("should call console.warn when logger.warn is called", () => {
      const { logger: devLogger } = require("../logger")
      devLogger.warn("warning message")
      expect(mockConsoleWarn).toHaveBeenCalledWith("warning message")
    })

    it("should call console.info when logger.info is called", () => {
      const { logger: devLogger } = require("../logger")
      devLogger.info("info message")
      expect(mockConsoleInfo).toHaveBeenCalledWith("info message")
    })

    it("should call console.debug when logger.debug is called", () => {
      const { logger: devLogger } = require("../logger")
      devLogger.debug("debug message")
      expect(mockConsoleDebug).toHaveBeenCalledWith("debug message")
    })

    it("should handle multiple arguments", () => {
      const { logger: devLogger } = require("../logger")
      devLogger.log("arg1", "arg2", "arg3")
      expect(mockConsoleLog).toHaveBeenCalledWith("arg1", "arg2", "arg3")
    })
  })

  describe("in production mode", () => {
    beforeEach(() => {
      // Set __DEV__ to false to test production path
      // @ts-ignore
      global.__DEV__ = false
    })

    it("should not call console methods in production", () => {
      const { logger: prodLogger } = require("../logger")
      prodLogger.log("test")
      prodLogger.error("test")
      prodLogger.warn("test")
      prodLogger.info("test")
      prodLogger.debug("test")

      expect(mockConsoleLog).not.toHaveBeenCalled()
      expect(mockConsoleError).not.toHaveBeenCalled()
      expect(mockConsoleWarn).not.toHaveBeenCalled()
      expect(mockConsoleInfo).not.toHaveBeenCalled()
      expect(mockConsoleDebug).not.toHaveBeenCalled()
    })

    it("should have no-op functions in production", () => {
      const { logger: prodLogger } = require("../logger")
      expect(() => prodLogger.log("test")).not.toThrow()
      expect(() => prodLogger.error("test")).not.toThrow()
      expect(() => prodLogger.warn("test")).not.toThrow()
      expect(() => prodLogger.info("test")).not.toThrow()
      expect(() => prodLogger.debug("test")).not.toThrow()
    })
  })

  describe("logger methods exist", () => {
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = true
    })

    it("should have all required methods", () => {
      const { logger } = require("../logger")
      expect(typeof logger.log).toBe("function")
      expect(typeof logger.error).toBe("function")
      expect(typeof logger.warn).toBe("function")
      expect(typeof logger.info).toBe("function")
      expect(typeof logger.debug).toBe("function")
    })

    it("should not throw when called", () => {
      const { logger } = require("../logger")
      expect(() => logger.log("test")).not.toThrow()
      expect(() => logger.error("test")).not.toThrow()
      expect(() => logger.warn("test")).not.toThrow()
      expect(() => logger.info("test")).not.toThrow()
      expect(() => logger.debug("test")).not.toThrow()
    })
  })
})
