import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import generateMonth from "../utilities/generateMonth";
import dayjs from "dayjs";

export type CalendarState = {
  array: dayjs.Dayjs[][];
  current: {
    month: number;
    week: number;
    day: number;
  };
};

const initialState: CalendarState = {
  array: generateMonth(),
  current: {
    month: dayjs().month(),
    week: 0,
    day: 0,
  },
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

export default calendarSlice.reducer;
