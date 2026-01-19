import type { FC } from "react";
import type { Task } from "../../../entities/model/types";
import { Box,
    Typography,
    Chip,
    Stack,
    IconButton,
} from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch } from "../../../shared/providers/store/hooks";
import { deleteTask } from "../../../entities/model/thunks";
import { Link } from "react-router-dom";
import { IMPORTANCE_COLORS } from "../../../entities/model/constants";
import TodoItemForm from "../../TodoItemForm";


type Props = {
    task: Task;
};

const importanceLabels: Record<Task["importance"], string> = {
    urgent_not_important: "Срочно, но неважно",
    urgent_important: "Срочно и важно",
    not_urgent_important: "Не срочно, но важно",
    not_urgent_not_important: "Не срочно и не важно",
};

const TodoItem: FC<Props> = ({ task }) => {
    const dispatch = useAppDispatch();

    const [isEditing, setIsEditing] = useState(false);

    const handleEditStart = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSaved = (updated: Task) => {
        void updated;
        setIsEditing(false);
    };

    const handleDelete = () => {
        dispatch(deleteTask(task.id));
    };

    const chipColor = IMPORTANCE_COLORS[task.importance];

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
                            <TodoItemForm task={task} onCancel={handleCancel} onSaved={handleSaved} />
                            ):(
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                            <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                <Link to={`/todo/${task.id}`} style={{ textDecoration: "none", color: "inherit" }} title={task.title}>
                                    <Typography variant="body1" sx={{ fontWeight: task.done ? 400 : 600 }}>
                                        {task.title}
                                    </Typography>
                                </Link>
                            </Box>

                            <Chip
                                label={importanceLabels[task.importance]}
                                size="small"
                                color={chipColor}
                            />
                        </Box>
                    )}
                </Box>

                    {!isEditing && (
                        <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                            <IconButton aria-label="Редактировать" size="small" onClick={handleEditStart}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="Удалить" size="small" onClick={handleDelete}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                </Box>
                )}
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 0 }}>
                {task.due ?? "Срок не указан"}
            </Typography>
        </Box>
    );
};

export default TodoItem;