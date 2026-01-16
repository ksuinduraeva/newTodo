import { z } from "zod";
import type { Task } from "../../../entities/model/types";
import { IMPORTANCE_VALUES } from "../../../entities/model/constants";

export const importanceEnum = z.enum(IMPORTANCE_VALUES);

export const taskSchema = z.object({
    title: z
        .string()
        .min(1, "Название обязательно")
        .transform((inputString) => inputString.trim()),

    due: z.preprocess(
        (rawValue) => {
            if (typeof rawValue === "string") {
                const trimmedString = rawValue.trim();
                return trimmedString === "" ? undefined : trimmedString;
            }
            return rawValue;
        },
        z
            .string()
            .optional()
            .refine((dateString) => !dateString || !isNaN(Date.parse(dateString)), "Введите дату")
            .transform((dateString) => (dateString ? new Date(dateString).toISOString() : undefined))
    ),

    importance: importanceEnum,
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const createTaskSchema = taskSchema;
export const updateTaskSchema = taskSchema.partial();

export const mapFormToTask = (formValues: TaskFormValues, initialId?: string): Task => {
    return {
        id: initialId ?? crypto.randomUUID(),
        title: formValues.title,
        due: formValues.due ?? undefined,
        importance: formValues.importance,
    };
};
