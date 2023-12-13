import { createSlice } from "@reduxjs/toolkit";

export type TasksState = {
  tasks: string[];
};

const initialState: TasksState = {
  tasks: ["Hello"],
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
});

export default tasksSlice.reducer;
