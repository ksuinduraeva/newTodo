import type { FC } from "react";
import { useEffect } from "react";
import TodoForm from "../../../widgets/TodoForm";
import TodoListItem from "../../../widgets/TodoListItem";
import type { Task, Importance } from "../../../entities/model/types";
import { useAppDispatch, useAppSelector } from "../../../shared/providers/store/hooks";
import { addTask, replaceAllTasks } from "../../../entities/model/slice";
import { useGetPostsQuery } from "../../../shared/services/postsApi";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import { selectAllTasks } from "../../../entities/model/selectors";

const TodoListPage: FC = () => {

    const tasks = useAppSelector(selectAllTasks);
    const dispatch = useAppDispatch();

    const handleSaved = (task: Task) => {
        dispatch(addTask(task));
    };

    const { data: postsData, isLoading, isError, error } = useGetPostsQuery();

    useEffect(() => {
        if (postsData && postsData.length) {
            const mapped = postsData.slice(0, 10).map((post) => ({
                id: String(post.id),
                title: post.title,
                importance: "not_urgent_not_important" as Importance,
                due: undefined,
            }));
            dispatch(replaceAllTasks(mapped));
        }
    }, [postsData, dispatch]);

    if (isLoading) {
        return (
                <CircularProgress />
        );
    }

    if (isError) {
        return (
                <Alert severity="error">Ошибка загрузки{error ? `: ${String(error)}` : ""}</Alert>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Список задач
            </Typography>

            <Box component="section" sx={{ mb: 2 }}>
                <TodoForm onSaved={handleSaved} submitLabel="Добавить задачу" />
            </Box>

            <Box component="section">
                {tasks.length === 0 ? (
                    <Typography color="text.secondary">Список пуст</Typography>
                ) : (
                    <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                        {tasks.map(task => <TodoListItem key={task.id} task={task} />)}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default TodoListPage;
