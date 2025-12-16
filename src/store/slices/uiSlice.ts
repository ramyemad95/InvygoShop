import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { loadString, saveString } from "@/utils/storage"

type Theme = "light" | "dark"
type Language = "en" | "ar"

interface UIState {
  theme: Theme
  language: Language
}

const loadTheme = (): Theme => {
  const saved = loadString("app.theme")
  return (saved as Theme) || "light"
}

const loadLanguage = (): Language => {
  const saved = loadString("app.language")
  return (saved as Language) || "en"
}

const initialState: UIState = {
  theme: loadTheme(),
  language: loadLanguage(),
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
      saveString("app.theme", action.payload)
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
      saveString("app.language", action.payload)
    },
  },
})

export const { setTheme, setLanguage } = uiSlice.actions
export default uiSlice.reducer
