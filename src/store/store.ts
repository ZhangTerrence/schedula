import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./calendarSlice";
import tasksReducer from "./tasksSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
