import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../shared/providers/store";
import type { Task } from "./types";

export const selectTasksState = (state: RootState) => state.tasks;

export const selectAllTasks = (state: RootState): Task[] =>
    selectTasksState(state)?.items ?? [];

export const selectTasksCount = createSelector(
    [selectAllTasks],
    (items) => items.length
);

export const selectTaskId = (state: RootState, id?: string | undefined): Task | null =>
    id ? selectAllTasks(state).find((it) => it.id === id) ?? null : null;
