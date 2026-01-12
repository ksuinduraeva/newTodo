import { createAsyncThunk } from "@reduxjs/toolkit";
import { postsApi } from "../../shared/services/postsApi";
import { updateTask, removeTaskById } from "./slice";
import type { Task } from "./types";

export const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (id: string, thunkAPI) => {
        const numericId = Number(id);
        const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${numericId}`,
            { method: "DELETE" }
        );
        if (!res.ok) {
            return thunkAPI.rejectWithValue("Delete failed");
        }

        thunkAPI.dispatch(removeTaskById(id));
        thunkAPI.dispatch(postsApi.util.invalidateTags(["Posts"]));

        return id;
    }
);

export const editTask = createAsyncThunk(
    "tasks/editTask",
    async (task: Task, thunkAPI) => {
        const numericId = Number(task.id);
        const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${numericId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: task.title,
                    body: task.due ?? "",
                    userId: 1,
                    importance: task.importance,
                }),
            }
        );
        if (!res.ok) {
            return thunkAPI.rejectWithValue("Edit failed");
        }
        const data = await res.json();

        const updated: Task = {
            ...task,
            title: data.title ?? task.title,
            importance: (data.importance as Task["importance"]) ?? task.importance,
        };
        thunkAPI.dispatch(updateTask(updated));
        thunkAPI.dispatch(postsApi.util.invalidateTags(["Posts"]));

        return updated;
    }
);
