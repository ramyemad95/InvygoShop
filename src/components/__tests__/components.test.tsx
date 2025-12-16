import { fireEvent, render } from "@testing-library/react-native"

import { lightTheme } from "@/theme/theme"

import { CarListItemShimmer } from "../CarListItemShimmer"
import { CheckoutModal } from "../CheckoutModal"

const themed = (styles: any) => {
  const list = [styles]
    .flat(3)
    .map((style) => (typeof style === "function" ? style(lightTheme) : style))
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

describe("CarListItemShimmer", () => {
  it("sizes shimmer based on screen width", () => {
    jest.spyOn(require("react-native"), "useWindowDimensions").mockReturnValue({
      width: 800,
      height: 600,
      scale: 1,
      fontScale: 1,
    })

    const tree = render(<CarListItemShimmer />).toJSON() as any
    const rootStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style)
      : tree.props.style

    expect(rootStyle.width).toBeCloseTo(376)
    expect(rootStyle.backgroundColor).toBe(lightTheme.colors.palette.neutral100)
  })

  it("uses full width layout on phones", () => {
    jest.spyOn(require("react-native"), "useWindowDimensions").mockReturnValue({
      width: 400,
      height: 600,
      scale: 1,
      fontScale: 1,
    })

    const tree = render(<CarListItemShimmer />).toJSON() as any
    const rootStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style)
      : tree.props.style

    expect(rootStyle.width).toBeCloseTo(368)
  })
})

describe("CheckoutModal", () => {
  const car = {
    brand: "Tesla",
    name: "Model S",
    price: 120000,
    main_image: "img",
    secondary_images: [],
    specs: "business" as const,
    rent_price_per_day: 200,
    available_colors: ["red"],
  }

  it("validates fields before confirming purchase", () => {
    const onConfirm = jest.fn()
    const onClose = jest.fn()

    const { getByText, getByPlaceholderText, queryByText, getByTestId } = render(
      <CheckoutModal
        visible
        car={car as any}
        selectedColor="Red"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )

    fireEvent.press(getByTestId("checkout-confirm"))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(getByText("checkoutModal:cardNumberError")).toBeTruthy()
    expect(getByText("checkoutModal:cardHolderError")).toBeTruthy()
    expect(getByText("checkoutModal:expiryFormatError")).toBeTruthy()
    expect(getByText("checkoutModal:cvvError")).toBeTruthy()

    fireEvent.changeText(getByPlaceholderText("1234 5678 9012 3456"), "4111 1111 1111 1111")
    fireEvent.changeText(getByPlaceholderText("John Doe"), "John Doe")
    fireEvent.changeText(getByPlaceholderText("MM/YY"), "1225")
    fireEvent.changeText(getByPlaceholderText("123"), "123")

    fireEvent.press(getByTestId("checkout-confirm"))

    expect(queryByText("checkoutModal:cardNumberError")).toBeNull()
    expect(onConfirm).toHaveBeenCalledTimes(1)

    expect(getByTestId("checkout-cancel")).toBeTruthy()
  })
})
