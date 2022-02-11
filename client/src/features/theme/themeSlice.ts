import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
  isDark: boolean;
  darkTheme: any;
  lightTheme: any;
}

// Initial State
const initialState: ThemeState = {
  isDark: false,
  lightTheme: {
    bodyBackground: "#f0f0f0",
    postItemBackground: "#f0f0f0",
    navBackground: "#fff",
  },
  darkTheme: {
    bodyBackground: "#18191A",
    postItemBackground: "#1e1a1a",
    navBackground: "#242526",
  },
};

// Main Slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    makeDark: (state) => {
      state.isDark = true;
    },
    makeLight: (state) => {
      state.isDark = false;
    },
  },
});

export const { makeDark, makeLight } = themeSlice.actions;
export default themeSlice.reducer;
