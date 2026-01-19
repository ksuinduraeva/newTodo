import type { Importance } from "./constants";
export type { Importance };

export interface Task {
    id: string;
    title: string;
    due?: string;
    done?: boolean;
    importance: Importance;
}
