import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

import { fetchCars } from "@/api/carsApi"
import { Car } from "@/types/car"
import { logger } from "@/utils/logger"

interface CarsState {
  cars: Car[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  total: number
}

const initialState: CarsState = {
  cars: [],
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: true,
  total: 0,
}

export const loadCars = createAsyncThunk(
  "cars/loadCars",
  async ({ page = 1, searchQuery = "" }: { page?: number; searchQuery?: string } = {}) => {
    const result = await fetchCars(page, searchQuery)
    return { ...result, page, searchQuery }
  },
)

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    resetCars: (state) => {
      state.cars = []
      state.hasMore = true
      state.total = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCars.pending, (state, action) => {
        const page = action.meta.arg?.page || 1
        if (page === 1) {
          state.loading = true
          state.cars = []
          state.hasMore = true
        } else {
          // Only set loadingMore if not already loading
          if (!state.loadingMore) {
            state.loadingMore = true
          }
        }
        state.error = null
      })
      .addCase(
        loadCars.fulfilled,
        (
          state,
          action: PayloadAction<{
            cars: Car[]
            total: number
            hasMore: boolean
            page: number
            searchQuery?: string
          }>,
        ) => {
          const { cars, total, hasMore, page } = action.payload
          if (page === 1) {
            state.loading = false
            state.cars = cars
          } else {
            state.loadingMore = false
            // Only append if we don't already have these cars (prevent duplicates)
            const existingIds = new Set(state.cars.map((c) => `${c.brand}-${c.name}`))
            const newCars = cars.filter((c) => !existingIds.has(`${c.brand}-${c.name}`))
            state.cars = [...state.cars, ...newCars]
          }
          state.total = total
          state.hasMore = hasMore
        },
      )
      .addCase(loadCars.rejected, (state, action) => {
        state.loading = false
        state.loadingMore = false
        state.error = action.error.message || "Failed to load cars"
      })
  },
})

export const { resetCars } = carsSlice.actions
export default carsSlice.reducer
