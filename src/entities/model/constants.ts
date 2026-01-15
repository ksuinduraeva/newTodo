export const IMPORTANCE_VALUES = [
    "urgent_not_important",
    "urgent_important",
    "not_urgent_important",
    "not_urgent_not_important",
] as const;

export type Importance = (typeof IMPORTANCE_VALUES)[number];

export const IMPORTANCE_LABELS: Record<Importance, string> = {
    urgent_not_important: "Срочно, но неважно",
    urgent_important: "Срочно и важно",
    not_urgent_important: "Не срочно, но важно",
    not_urgent_not_important: "Не срочно и не важно",
};


