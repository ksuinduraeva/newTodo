import type { FC } from "react";
import type { Task, Importance } from "../../../entities/model/types";
import { Box,
    Typography,
    Chip,
    Stack,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel, } from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "../../../shared/providers/store/hooks";
import { deleteTask, editTask } from "../../../entities/model/thunks";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { mapFormToTask, taskSchema } from "../../../shared/forms/schemas/taskSchema.ts";
import type { TaskFormValues } from "../../../shared/forms/schemas/taskSchema.ts";


type Props = {
    task: Task;
};

const importanceLabels: Record<Task["importance"], string> = {
    urgent_not_important: "Срочно, но неважно",
    urgent_important: "Срочно и важно",
    not_urgent_important: "Не срочно, но важно",
    not_urgent_not_important: "Не срочно и не важно",
};

const importanceColor: Record<Task["importance"], "error" | "warning" | "info" | "default"> = {
    urgent_important: "error",
    urgent_not_important: "warning",
    not_urgent_important: "info",
    not_urgent_not_important: "default",
};

const IMPORTANCE_OPTIONS: Importance[] = [
    "urgent_important",
    "urgent_not_important",
    "not_urgent_important",
    "not_urgent_not_important",
];

const TodoItem: FC<Props> = ({ task }) => {
    const dispatch = useAppDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, reset } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema) as unknown as Resolver<TaskFormValues>,
        defaultValues: {
            title: task.title,
            due: task.due ? task.due.split("T")[0] : "",
            importance: task.importance,
        }
    });

    const handleEditStart = () => {
        reset({title: task.title,
            due: task.due ? task.due.split("T")[0] : "",
            importance: task.importance})
        setIsEditing(true);
    };

    const handleCancel = () => {
        reset({title: task.title,
            due: task.due ? task.due.split("T")[0] : "",
            importance: task.importance})
        setIsEditing(false);
    };

    const onSubmit: SubmitHandler<TaskFormValues> = async (formValues) => {
        const trimmed = formValues.title.trim();
        if (trimmed === "") {
            reset({title: task.title,
                due: task.due ? task.due.split("T")[0] : "",
                importance: task.importance,
            });
            setIsEditing(false);
            return;
        }

    const updated: Task = mapFormToTask(formValues, task.id);

        setIsSaving(true);
        try {
            await dispatch(editTask(updated)).unwrap();
            setIsEditing(false);
        } catch (err) {
            console.error("Не удалось сохранить задачу:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        dispatch(deleteTask(task.id));
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                p: 1,
                borderRadius: 2,
                bgcolor: "background.paper",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                    {isEditing ? (
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
                                        handleCancel();
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
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                            <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                <Link to={`/todo/${task.id}`} style={{ textDecoration: "none", color: "inherit" }} title={task.title}>
                                    <Typography variant="body1" sx={{ fontWeight: (task as any).done ? 400 : 600 }}>
                                        {task.title}
                                    </Typography>
                                </Link>
                            </Box>

                            <Chip
                                label={importanceLabels[task.importance]}
                                size="small"
                                color={importanceColor[task.importance] === "default" ? undefined : (importanceColor[task.importance] as any)}
                            />
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                    {isEditing ? (
                        <>
                            <IconButton aria-label="Сохранить" size="small" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                                <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="Отменить" size="small" onClick={handleCancel} disabled={isSaving}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton aria-label="Редактировать" size="small" onClick={handleEditStart}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="Удалить" size="small" onClick={handleDelete}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </>
                    )}
                </Box>
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 0 }}>
                {task.due ?? "Срок не указан"}
            </Typography>
        </Box>
    );
};

export default TodoItem;