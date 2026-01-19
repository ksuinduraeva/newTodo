import type { FC } from "react";
import type { Task, Importance } from "../../../entities/model/types";
import { Box,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel, } from "@mui/material";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "../../../shared/providers/store/hooks";
import { editTask } from "../../../entities/model/thunks";
import { useForm, Controller } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { mapFormToTask, taskSchema } from "../../../shared/forms/schemas/taskSchema.ts";
import type { TaskFormValues } from "../../../shared/forms/schemas/taskSchema.ts";
import type { Resolver } from "react-hook-form";


type Props = {
    task: Task;
    onCancel: () => void;
    onSaved?: (updated: Task) => void;
};

const IMPORTANCE_OPTIONS: Importance[] = [
    "urgent_important",
    "urgent_not_important",
    "not_urgent_important",
    "not_urgent_not_important",
];

const importanceLabels: Record<Importance, string> = {
    urgent_not_important: "Срочно, но неважно",
    urgent_important: "Срочно и важно",
    not_urgent_important: "Не срочно, но важно",
    not_urgent_not_important: "Не срочно и не важно",
};

const TodoItemForm: FC<Props> = ({ task, onCancel, onSaved }) => {
    const dispatch = useAppDispatch();

    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, reset } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema) as unknown as Resolver<TaskFormValues>,
        defaultValues: {
            title: task.title,
            due: task.due ? task.due.split("T")[0] : "",
            importance: task.importance,
        }
    });

    const doCancel = () => {
        reset({title: task.title,
            due: task.due ? task.due.split("T")[0] : "",
            importance: task.importance})
        onCancel();
    };

    const onSubmit = async (formValues: TaskFormValues) => {
        const trimmed = formValues.title.trim();
        if (trimmed === "") {
            reset({title: task.title,
                due: task.due ? task.due.split("T")[0] : "",
                importance: task.importance,
            });
            onCancel();
            return;
        }

        const updated: Task = mapFormToTask(formValues, task.id);

        setIsSaving(true);
        try {
            await dispatch(editTask(updated)).unwrap();
            onSaved?.(updated);
        } catch (err) {
            console.error("Не удалось сохранить задачу:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            sx={{ display: "flex", gap: 1, alignItems: "center", flex: 1, minWidth: 0 }}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) =>(
                                    <TextField
                                        {...field}
                                        size="small"
                                        sx={{ flex: 1, minWidth: 0 }}
                                        autoFocus
                                        onKeyDown={(event) => {
                                            if (event.key === "Escape") {
                                                event.preventDefault();
                                                doCancel();
                                            }
                                        }}
                                    />
                                )}
                            />

                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel id={`importance-label-${task.id}`}>Важность</InputLabel>
                                <Controller
                                    name="importance"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId={`importance-label-${task.id}`}
                                            label="Важность"
                                        >
                                            {IMPORTANCE_OPTIONS.map((opt) => (
                                                <MenuItem key={opt} value={opt}>
                                                    {importanceLabels[opt]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>

                <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                            <IconButton aria-label="Сохранить" size="small" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                                <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="Отменить" size="small" onClick={doCancel} disabled={isSaving}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                </Box>
        </Box>
    );
};

export default TodoItemForm;