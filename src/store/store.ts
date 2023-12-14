import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./calendarSlice";
import modeReducer from "./modeSlice";
import eventsReducer from "./eventsSlice";
import tasksReducer from "./tasksSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    mode: modeReducer,
    events: eventsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
