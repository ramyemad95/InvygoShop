import carsReducer, { loadCars, resetCars } from "../carsSlice"
import filtersReducer, {
  resetFilters,
  setPriceRange,
  setSearchQuery,
  setSelectedColors,
  toggleColor,
} from "../filtersSlice"

const mockLoadString = jest.fn()
const mockSaveString = jest.fn()

jest.mock("@/utils/storage", () => ({
  loadString: (...args: unknown[]) => mockLoadString(...args),
  saveString: (...args: unknown[]) => mockSaveString(...args),
}))

const sampleCar = {
  brand: "Tesla",
  name: "Model S",
  price: 120000,
  main_image: "img",
  secondary_images: [],
  specs: "business" as const,
  rent_price_per_day: 200,
  available_colors: ["red", "blue"],
}

describe("carsSlice", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("handles pending state for first page", () => {
    const state = carsReducer(undefined, loadCars.pending("req", { page: 1, searchQuery: "" }))
    expect(state.loading).toBe(true)
    expect(state.cars).toEqual([])
    expect(state.hasMore).toBe(true)
  })

  it("stores first page results on fulfilled", () => {
    const state = carsReducer(
      undefined,
      loadCars.fulfilled(
        { cars: [sampleCar], total: 1, hasMore: false, page: 1, searchQuery: "" },
        "req",
        {
          page: 1,
          searchQuery: "",
        },
      ),
    )

    expect(state.cars).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.hasMore).toBe(false)
    expect(state.total).toBe(1)
  })

  it("appends non-duplicate cars on next pages", () => {
    const initial = carsReducer(
      undefined,
      loadCars.fulfilled(
        { cars: [sampleCar], total: 2, hasMore: true, page: 1, searchQuery: "" },
        "req",
        {
          page: 1,
          searchQuery: "",
        },
      ),
    )

    const moreCars = [
      sampleCar, // duplicate should be filtered out
      { ...sampleCar, name: "Model 3" },
    ]

    const state = carsReducer(
      { ...initial, loading: false, loadingMore: true },
      loadCars.fulfilled(
        { cars: moreCars, total: 2, hasMore: false, page: 2, searchQuery: "" },
        "req2",
        {
          page: 2,
          searchQuery: "",
        },
      ),
    )

    expect(state.cars.map((c) => c.name)).toEqual(["Model S", "Model 3"])
    expect(state.loadingMore).toBe(false)
    expect(state.hasMore).toBe(false)
  })

  it("sets error on rejection", () => {
    const state = carsReducer(
      undefined,
      loadCars.rejected(new Error("fail"), "req", { page: 1, searchQuery: "" }),
    )
    expect(state.error).toBe("fail")
    expect(state.loading).toBe(false)
    expect(state.loadingMore).toBe(false)
  })

  it("keeps loadingMore true when already paginating", () => {
    const base = carsReducer(undefined, { type: "init" } as any)
    const state = carsReducer(
      { ...(base as any), loadingMore: true },
      loadCars.pending("req", { page: 2, searchQuery: "" }),
    )
    expect(state.loadingMore).toBe(true)
  })

  it("handles pending state for page without page arg", () => {
    const state = carsReducer(undefined, loadCars.pending("req", {}))
    expect(state.loading).toBe(true)
  })

  it("handles pending state with undefined arg", () => {
    const state = carsReducer(undefined, loadCars.pending("req", undefined))
    expect(state.loading).toBe(true)
  })

  it("handles page arg as undefined in pending", () => {
    const action = loadCars.pending("req", { page: undefined, searchQuery: "" })
    const state = carsReducer(undefined, action)
    expect(state.loading).toBe(true)
  })

  it("handles fulfilled with page 1 replacing existing cars", () => {
    const initialState = carsReducer(
      undefined,
      loadCars.fulfilled(
        { cars: [sampleCar], total: 1, hasMore: false, page: 1, searchQuery: "" },
        "req",
        { page: 1, searchQuery: "" },
      ),
    )

    const state = carsReducer(
      initialState,
      loadCars.fulfilled(
        { cars: [{ ...sampleCar, name: "Model 3" }], total: 2, hasMore: false, page: 1, searchQuery: "" },
        "req2",
        { page: 1, searchQuery: "" },
      ),
    )

    // Should replace cars, not append
    expect(state.cars).toHaveLength(1)
    expect(state.cars[0].name).toBe("Model 3")
  })

  it("sets loadingMore true when fetching next page", () => {
    const base = carsReducer(
      undefined,
      loadCars.fulfilled(
        { cars: [sampleCar], total: 2, hasMore: true, page: 1, searchQuery: "" },
        "req",
        {
          page: 1,
          searchQuery: "",
        },
      ),
    )

    const state = carsReducer(base, loadCars.pending("req", { page: 2 }))
    expect(state.loadingMore).toBe(true)
  })

  it("falls back to default error message when missing", () => {
    const action: any = loadCars.rejected({ name: "Error" } as any, "req", {
      page: 1,
      searchQuery: "",
    })
    action.error = {}
    const state = carsReducer(undefined, action)
    expect(state.error).toBe("Failed to load cars")
  })

  it("resets cars", () => {
    const populatedState = carsReducer(
      undefined,
      loadCars.fulfilled(
        { cars: [sampleCar], total: 1, hasMore: false, page: 1, searchQuery: "" },
        "req",
        {
          page: 1,
          searchQuery: "",
        },
      ),
    )

    const state = carsReducer(populatedState, resetCars())
    expect(state.cars).toEqual([])
    expect(state.total).toBe(0)
    expect(state.hasMore).toBe(true)
  })
})

describe("filtersSlice", () => {
  it("sets search query and colors", () => {
    let state = filtersReducer(undefined, setSearchQuery("suv"))
    state = filtersReducer(state, setSelectedColors(["blue"]))
    expect(state.searchQuery).toBe("suv")
    expect(state.selectedColors).toEqual(["blue"])
  })

  it("toggles colors and resets filters", () => {
    let state = filtersReducer(undefined, toggleColor("red"))
    state = filtersReducer(state, toggleColor("red"))
    expect(state.selectedColors).toEqual([])

    state = filtersReducer(state, setPriceRange({ min: 10, max: 50 }))
    state = filtersReducer(state, resetFilters())
    expect(state).toMatchObject({
      searchQuery: "",
      selectedColors: [],
      priceRange: { min: null, max: null },
    })
  })
})

describe("uiSlice", () => {
  beforeEach(() => {
    jest.resetModules()
    mockLoadString.mockReset()
    mockSaveString.mockReset()
  })

  it("uses persisted values for initial state", () => {
    mockLoadString
      .mockReturnValueOnce("dark") // theme
      .mockReturnValueOnce("ar") // language

    jest.isolateModules(() => {
      const uiModule = require("../uiSlice")
      const reducer = uiModule.default
      const state = reducer(undefined, { type: "init" })
      expect(state.theme).toBe("dark")
      expect(state.language).toBe("ar")
    })
  })

  it("saves theme and language updates", () => {
    mockLoadString.mockReturnValue(null)

    jest.isolateModules(() => {
      const uiModule = require("../uiSlice")
      const reducer = uiModule.default
      const { setTheme, setLanguage } = uiModule

      let state = reducer(undefined, setTheme("dark"))
      expect(state.theme).toBe("dark")
      expect(mockSaveString).toHaveBeenCalledWith("app.theme", "dark")

      state = reducer(state, setLanguage("ar"))
      expect(state.language).toBe("ar")
      expect(mockSaveString).toHaveBeenCalledWith("app.language", "ar")
    })
  })
})
