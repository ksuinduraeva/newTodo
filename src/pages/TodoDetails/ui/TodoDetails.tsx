import type { FC } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Task } from "../../../entities/model/types";
import { useAppSelector } from "../../../shared/providers/store/hooks";
import { selectTaskId } from "../../../entities/model/selectors";
import { Container,
    Paper,
    Typography,
    Stack,
    Button,
    Box,
    Chip } from "@mui/material";
import { IMPORTANCE_COLORS } from "../../../entities/model/constants";

const importanceLabel: Record<Task["importance"], string> = {
    urgent_not_important: "Срочно, но неважно",
    urgent_important: "Срочно и важно",
    not_urgent_important: "Не срочно, но важно",
    not_urgent_not_important: "Не срочно и не важно",
};

const TodoDetails: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const task = useAppSelector((state) =>
        selectTaskId(state, id)) as Task | null;

    const chipColor = task ? IMPORTANCE_COLORS[task.importance] : undefined;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Детали задачи
            </Typography>

            <Paper sx={{ padding: 3 }}>
                <Stack spacing={2}>
                    {task ? (
                        <>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: "space-between" }}>
                                    <Box sx={{ flex: 1, pr: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {task.title}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={importanceLabel[task.importance]}
                                        size="small"
                                        color={chipColor}
                                    />
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Срок
                                </Typography>
                                <Typography variant="body2">{task.due ?? "Не указан"}</Typography>
                            </Box>

                        </>
                    ) : (
                        <Typography color="text.secondary">Задача не найдена</Typography>
                    )}

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Назад
                        </Button>

                        <Button component={Link} to="/" variant="contained" color="primary">
                            К списку задач
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
};

export default TodoDetails;
