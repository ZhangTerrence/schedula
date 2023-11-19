import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import generateMonth from "../utilities/generateMonth";
import dayjs from "dayjs";

export type CalendarState = {
  index: number;
  month: dayjs.Dayjs[][];
};

const initialState: CalendarState = {
  index: dayjs().month(),
  month: generateMonth(),
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    updateCalendar: (_state, action: PayloadAction<CalendarState>) => {
      return {
        ...action.payload,
      };
    },
  },
});

export const { updateCalendar } = calendarSlice.actions;

export const selectIndex = (state: RootState) => state.calendar.index;
export const selectMonth = (state: RootState) => state.calendar.month;

export default calendarSlice.reducer;
