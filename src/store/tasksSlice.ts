import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Event } from "./eventsSlice";

export type Task = Event & {
  completed: boolean;
};

export type TasksState = {
  tasks: Task[];
};

const initialState: TasksState = {
  tasks: [],
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );
      state.tasks[index] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<Task>) => {
      state.tasks = state.tasks.filter((task) => {
        return task.id !== action.payload.id;
      });
    },
  },
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
