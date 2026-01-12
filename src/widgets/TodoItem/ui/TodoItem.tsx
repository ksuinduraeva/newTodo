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
    const [draftTitle, setDraftTitle] = useState(task.title);
    const [isSaving, setIsSaving] = useState(false);
    const [draftImportance, setDraftImportance] = useState<Importance>(task.importance);

    const handleEditStart = () => {
        setDraftTitle(task.title);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setDraftTitle(task.title);
    };

    const handleSave = async (): Promise<void> => {
        const trimmed = draftTitle.trim();
        if (trimmed === "") {
            setDraftTitle(task.title);
            setIsEditing(false);
            return;
        }
        if (trimmed === task.title) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            const updated: Task = { ...task, title: trimmed, importance: draftImportance, };
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
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flex: 1, minWidth: 0 }}>
                            <TextField
                                size="small"
                                value={draftTitle}
                                onChange={(event) => setDraftTitle(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        void handleSave();
                                    } else if (event.key === "Escape") {
                                        event.preventDefault();
                                        handleCancel();
                                    }
                                }}
                                sx={{ flex: 1, minWidth: 0 }}
                                autoFocus
                            />

                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel id={`importance-label-${task.id}`}>Важность</InputLabel>
                                <Select
                                    labelId={`importance-label-${task.id}`}
                                    value={draftImportance}
                                    label="Важность"
                                    onChange={(event) => setDraftImportance(event.target.value as Importance)}
                                >
                                    {IMPORTANCE_OPTIONS.map((opt) => (
                                        <MenuItem key={opt} value={opt}>
                                            {importanceLabels[opt]}
                                        </MenuItem>
                                    ))}
                                </Select>
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
                            <IconButton aria-label="Сохранить" size="small" onClick={() => void handleSave()} disabled={isSaving}>
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