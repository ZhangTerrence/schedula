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
    updateTask: (state, action: PayloadAction<Object>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );
      state.tasks[index] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<Object>) => {
      state.tasks = state.tasks.filter((task) => {
        return task.id !== action.payload.id;
      });
    },
  },
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
