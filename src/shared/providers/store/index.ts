import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../../../entities/model/slice.ts";
import { postsApi } from "../../services/postsApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        [postsApi.reducerPath]: postsApi.reducer,
    },
    devTools: import.meta.env.MODE !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(postsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
