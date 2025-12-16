import React, { useEffect } from "react"
import { Linking, Text } from "react-native"
import { render, act } from "@testing-library/react-native"
import i18n from "i18next"

import { formatDate, loadDateFnsLocale } from "../formatDate"
import { delay } from "../delay"
import { openLinkInBrowser } from "../openLinkInBrowser"
import { useDebounce } from "../useDebounce"
import { useIsMounted } from "../useIsMounted"
import { useSafeAreaInsetsStyle } from "../useSafeAreaInsetsStyle"

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 10,
    bottom: 20,
    left: 5,
    right: 15,
  })),
}))

const TestDebounce = ({ value, wait }: { value: string; wait: number }) => {
  const debounced = useDebounce(value, wait)
  return <Text testID="debounced-value">{debounced}</Text>
}

const TestSafeArea = ({ edges }: { edges: Array<"top" | "end"> }) => {
  const style = useSafeAreaInsetsStyle(edges as any, "margin")
  return <Text testID="safe-area-style">{JSON.stringify(style)}</Text>
}

const TestIsMounted = ({ onCapture }: { onCapture: (value: boolean) => void }) => {
  const isMounted = useIsMounted()

  useEffect(() => {
    onCapture(isMounted())
    return () => onCapture(isMounted())
  }, [isMounted, onCapture])

  return null
}

describe("utils", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it("formats dates with loaded locale", () => {
    i18n.language = "en"
    loadDateFnsLocale()

    const result = formatDate("2025-01-15")
    expect(result).toBe("Jan 15, 2025")
  })

  it("supports alternate locales and custom formats", () => {
    i18n.language = "fr"
    loadDateFnsLocale()

    const result = formatDate("2025-01-15", "MM/dd/yyyy")
    expect(result).toBe("01/15/2025")
  })

  it("falls back to default locale when unsupported", () => {
    i18n.language = "zz-ZZ"
    loadDateFnsLocale()

    const result = formatDate("2025-02-20")
    expect(result).toContain("2025")
  })

  it("loads Arabic locale", () => {
    i18n.language = "ar"
    loadDateFnsLocale()
    const result = formatDate("2025-03-10", "yyyy/MM/dd")
    expect(result).toBe("2025/03/10")
  })

  it("loads Japanese locale", () => {
    i18n.language = "ja"
    loadDateFnsLocale()
    const result = formatDate("2025-04-05", "yyyy-MM-dd")
    expect(result).toBe("2025-04-05")
  })

  it("delays for the requested time", async () => {
    jest.useFakeTimers()
    const promise = delay(500)

    await act(async () => {
      jest.advanceTimersByTime(500)
      await promise
    })
  })

  it("opens links only when allowed", async () => {
    const canOpenSpy = jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true)
    const openUrlSpy = jest.spyOn(Linking, "openURL").mockResolvedValue()

    await openLinkInBrowser("https://example.com")
    expect(canOpenSpy).toHaveBeenCalledWith("https://example.com")
    expect(openUrlSpy).toHaveBeenCalledWith("https://example.com")

    canOpenSpy.mockResolvedValueOnce(false)
    await openLinkInBrowser("https://blocked.com")
    expect(openUrlSpy).not.toHaveBeenCalledWith("https://blocked.com")
  })

  it("debounces values over time", async () => {
    jest.useFakeTimers()
    const { getByTestId, rerender } = render(<TestDebounce value="first" wait={300} />)

    expect(getByTestId("debounced-value").props.children).toBe("first")

    rerender(<TestDebounce value="second" wait={300} />)
    expect(getByTestId("debounced-value").props.children).toBe("first")

    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    expect(getByTestId("debounced-value").props.children).toBe("second")
  })

  it("creates safe area inset styles", () => {
    const { getByTestId } = render(<TestSafeArea edges={["top", "end"]} />)
    const style = JSON.parse(getByTestId("safe-area-style").props.children)

    expect(style).toEqual({ marginTop: 10, marginEnd: 15 })
  })

  it("supports mapped start edge", () => {
    const { getByTestId } = render(<TestSafeArea edges={["start"]} />)
    const style = JSON.parse(getByTestId("safe-area-style").props.children)

    expect(style).toEqual({ marginStart: 5 })
  })

  it("returns empty style when no edges provided", () => {
    const { getByTestId } = render(<TestSafeArea edges={[]} />)
    const style = JSON.parse(getByTestId("safe-area-style").props.children)
    expect(style).toEqual({})
  })

  it("tracks mount lifecycle", () => {
    const captures: boolean[] = []
    const { unmount } = render(<TestIsMounted onCapture={(val) => captures.push(val)} />)

    expect(captures[captures.length - 1]).toBe(true)

    unmount()

    expect(captures[captures.length - 1]).toBe(false)
  })
})

