import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Event = {
  created_at: string;
  date: string;
  description: string;
  id: number;
  title: string;
  user_id: string;
};

export type EventsState = {
  events: Event[];
};

const initialState: EventsState = {
  events: [],
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id,
      );
      state.events[index] = action.payload;
    },
    deleteEvent: (state, action: PayloadAction<Event>) => {
      state.events = state.events.filter((event) => {
        return event.id !== action.payload.id;
      });
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
