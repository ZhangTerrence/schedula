import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type TasksState = {
  tasks: string[];
};

const initialState: TasksState = {
  tasks: [],
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
});

export const selectTasks = (state: RootState) => state.tasks.tasks;

export default tasksSlice.reducer;
