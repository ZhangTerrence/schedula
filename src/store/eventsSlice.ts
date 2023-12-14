import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Object } from "./tasksSlice";

export type EventsState = {
  events: Object[];
};

const initialState: EventsState = {
  events: [],
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Object>) => {
      state.events.push(action.payload);
    },
  },
});

export const { addEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
