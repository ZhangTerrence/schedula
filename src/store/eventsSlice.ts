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
    updateEvent: (state, action: PayloadAction<Object>) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id,
      );
      state.events[index] = action.payload;
    },
    deleteEvent: (state, action: PayloadAction<Object>) => {
      state.events = state.events.filter((event) => {
        return event.id !== action.payload.id;
      });
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
