import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ModeState = {
  mode: "month" | "week" | "day";
};

let initialState: ModeState = {
  mode: "month",
};

export const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    changeMode: (_state, action: PayloadAction<ModeState>) => {
      return action.payload;
    },
  },
});

export const { changeMode } = modeSlice.actions;

export default modeSlice.reducer;
