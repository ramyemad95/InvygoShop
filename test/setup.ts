// we always make sure 'react-native' gets included first
// eslint-disable-next-line no-restricted-imports
import * as ReactNative from "react-native"

import mockFile from "./mockFile"

// Initialize Dimensions before mocking
if (!ReactNative.Dimensions) {
  // @ts-ignore
  ReactNative.Dimensions = {
    get: jest.fn(() => ({ width: 375, height: 667, scale: 1, fontScale: 1 })),
    set: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }
}

// libraries to mock
jest.doMock("react-native", () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      Image: {
        ...ReactNative.Image,
        resolveAssetSource: jest.fn((_source) => mockFile), // eslint-disable-line @typescript-eslint/no-unused-vars
        getSize: jest.fn(
          (
            uri: string, // eslint-disable-line @typescript-eslint/no-unused-vars
            success: (width: number, height: number) => void,
            failure?: (_error: any) => void, // eslint-disable-line @typescript-eslint/no-unused-vars
          ) => success(100, 100),
        ),
      },
      Dimensions: ReactNative.Dimensions,
      NativeModules: {
        ...ReactNative.NativeModules,
        DevMenu: {
          show: jest.fn(),
          getConstants: jest.fn(() => ({})),
        },
        DeviceInfo: {
          getConstants: jest.fn(() => ({})),
        },
      },
    },
    ReactNative,
  )
})

jest.mock("i18next", () => {
  const i18nMock = {
    language: "en",
    currentLocale: "en",
    t: (key: string, params: Record<string, string>) => {
      return `${key} ${JSON.stringify(params)}`
    },
    translate: (key: string, params: Record<string, string>) => {
      return `${key} ${JSON.stringify(params)}`
    },
    changeLanguage: jest.fn((lng: string) => {
      i18nMock.language = lng
      return Promise.resolve()
    }),
  }

  return i18nMock
})

jest.mock("expo-localization", () => ({
  ...jest.requireActual("expo-localization"),
  getLocales: () => [{ languageTag: "en-US", textDirection: "ltr" }],
}))

jest.mock("../src/i18n/index.ts", () => ({
  i18n: {
    isInitialized: true,
    language: "en",
    t: (key: string, params: Record<string, string>) => {
      return `${key} ${JSON.stringify(params)}`
    },
    numberToCurrency: jest.fn(),
  },
}))

declare const tron // eslint-disable-line @typescript-eslint/no-unused-vars

declare global {
  let __TEST__: boolean
}
