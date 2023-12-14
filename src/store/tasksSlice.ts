import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Object = {
  created_at: string;
  date: string;
  description: string;
  id: number;
  title: string;
  user_id: string;
};

export type TasksState = {
  tasks: Object[];
};

const initialState: TasksState = {
  tasks: [],
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Object>) => {
      state.tasks.push(action.payload);
    },
  },
});

export const { addTask } = tasksSlice.actions;

export default tasksSlice.reducer;
