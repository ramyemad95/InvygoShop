import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux"

import carsReducer from "./slices/carsSlice"
import filtersReducer from "./slices/filtersSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

