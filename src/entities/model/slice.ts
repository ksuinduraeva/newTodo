import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../entities/model/types";

type TasksState = {
    items: Task[];
};

const initialState: TasksState = {
    items: [],
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask(state, action: PayloadAction<Task>) {
            state.items = [action.payload, ...state.items];
        },
        removeTaskById(state, action: PayloadAction<string>) {
            state.items = state.items.filter((it) => it.id !== action.payload);
        },
        replaceAllTasks(state, action: PayloadAction<Task[]>) {
            state.items = action.payload;
        },
        updateTask(state, action: PayloadAction<Task>) {
            const index = state.items.findIndex((it) => it.id === action.payload.id);
            if (index >= 0) state.items[index] = action.payload;
        },
    },
});

export const { addTask, removeTaskById, replaceAllTasks, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
