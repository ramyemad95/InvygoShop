import React from "react"
import { render } from "@testing-library/react-native"

import { Button } from "../Button"
import { Card } from "../Card"
import { Text } from "../Text"
import { TextField } from "../TextField"

// Mock theme context
const themed = (styles: any) => {
  const lightTheme = require("@/theme/theme").lightTheme
  const list = [styles]
    .flat(3)
    .map((style: any) => (typeof style === "function" ? style(lightTheme) : style))
  return Object.assign({}, ...list)
}

jest.mock("@/theme/context", () => ({
  useAppTheme: () => ({
    theme: require("@/theme/theme").lightTheme,
    themed,
  }),
}))

jest.mock("@/i18n/translate", () => ({
  translate: (key: string, options?: Record<string, unknown>) =>
    options ? `${key}:${JSON.stringify(options)}` : key,
}))

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  SafeAreaProvider: ({ children }: any) => children,
}))

describe("Component Snapshot Tests", () => {
  describe("Button", () => {
    it("should match snapshot with default preset", () => {
      const tree = render(<Button text="Click Me" onPress={() => {}} />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with filled preset", () => {
      const tree = render(<Button text="Submit" preset="filled" onPress={() => {}} />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with reversed preset", () => {
      const tree = render(<Button text="Cancel" preset="reversed" onPress={() => {}} />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot when disabled", () => {
      const tree = render(<Button text="Disabled" disabled onPress={() => {}} />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with translation key", () => {
      const tree = render(<Button tx="common:ok" onPress={() => {}} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe("Card", () => {
    it("should match snapshot with default preset", () => {
      const tree = render(
        <Card heading="Card Title" content="Card content goes here" footer="Card footer" />,
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with reversed preset", () => {
      const tree = render(
        <Card preset="reversed" heading="Dark Card" content="Dark card content" />,
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot as pressable", () => {
      const tree = render(
        <Card heading="Pressable Card" content="Tap me" onPress={() => {}} />,
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with center alignment", () => {
      const tree = render(
        <Card heading="Centered" content="Content" verticalAlignment="center" />,
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe("Text", () => {
    it("should match snapshot with heading preset", () => {
      const tree = render(<Text preset="heading" text="Heading Text" />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with subheading preset", () => {
      const tree = render(<Text preset="subheading" text="Subheading Text" />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with formLabel preset", () => {
      const tree = render(<Text preset="formLabel" text="Form Label" />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with translation key", () => {
      const tree = render(<Text tx="common:ok" />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe("TextField", () => {
    it("should match snapshot with placeholder", () => {
      const tree = render(
        <TextField placeholder="Enter text" value="" onChangeText={() => {}} />,
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with value", () => {
      const tree = render(
        <TextField placeholder="Email" value="test@example.com" onChangeText={() => {}} />,
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with error status", () => {
      const tree = render(
        <TextField
          placeholder="Email"
          value="invalid"
          onChangeText={() => {}}
          status="error"
          helper="Invalid email"
        />,
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("should match snapshot with numeric keyboard", () => {
      const tree = render(
        <TextField placeholder="Price" value="" keyboardType="numeric" onChangeText={() => {}} />,
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
