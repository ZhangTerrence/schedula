import { createSlice } from "@reduxjs/toolkit";

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

export default tasksSlice.reducer;
