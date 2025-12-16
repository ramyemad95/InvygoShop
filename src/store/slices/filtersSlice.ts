import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface FiltersState {
  searchQuery: string
  selectedColors: string[]
  priceRange: {
    min: number | null
    max: number | null
  }
}

const initialState: FiltersState = {
  searchQuery: "",
  selectedColors: [],
  priceRange: {
    min: null,
    max: null,
  },
}

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSelectedColors: (state, action: PayloadAction<string[]>) => {
      state.selectedColors = action.payload
    },
    toggleColor: (state, action: PayloadAction<string>) => {
      const index = state.selectedColors.indexOf(action.payload)
      if (index === -1) {
        state.selectedColors.push(action.payload)
      } else {
        state.selectedColors.splice(index, 1)
      }
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.priceRange = action.payload
    },
    resetFilters: (state) => {
      state.searchQuery = ""
      state.selectedColors = []
      state.priceRange = { min: null, max: null }
    },
  },
})

export const { setSearchQuery, setSelectedColors, toggleColor, setPriceRange, resetFilters } =
  filtersSlice.actions
export default filtersSlice.reducer

