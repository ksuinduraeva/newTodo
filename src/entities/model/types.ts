export type Importance =
    | "urgent_not_important"
    | "urgent_important"
    | "not_urgent_important"
    | "not_urgent_not_important";

export interface Task {
    id: string;
    title: string;
    due?: string;
    importance: Importance;
}
