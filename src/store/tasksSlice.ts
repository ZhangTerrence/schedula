import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface TasksState {
  tasks: number;
}

const initialState: TasksState = {
  tasks: 0,
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
});

export const selectTasks = (state: RootState) => state.tasks.tasks;

export default tasksSlice.reducer;
