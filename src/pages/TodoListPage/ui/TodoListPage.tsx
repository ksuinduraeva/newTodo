import type { FC, ChangeEvent, KeyboardEvent } from "react";
import { useState, useEffect } from "react";
import TodoForm from "../../../widgets/TodoForm";
import TodoListItem from "../../../widgets/TodoListItem";
import type { Task, Importance } from "../../../entities/model/types";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../shared/providers/store/hooks";
import { addTask, replaceAllTasks } from "../../../entities/model/slice";
import { useGetPostsQuery } from "../../../shared/services/postsApi";
import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { selectAllTasks } from "../../../entities/model/selectors";

const TodoListPage: FC = () => {
    const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
    const [titleValue, setTitleValue] = useState<string>("");
    const [dueValue, setDueValue] = useState<string>("");
    const [importanceValue, setImportanceValue] = useState<Importance>("urgent_not_important");

    const tasks = useAppSelector(selectAllTasks);
    const dispatch = useAppDispatch();

    const handleAdd = () => {
        const trimmedTitle = titleValue.trim();
        if (!trimmedTitle) return;

        const newTask: Task = {
            id: uuidv4(),
            title: trimmedTitle,
            due: dueValue || undefined,
            importance: importanceValue,
        };

        dispatch(addTask(newTask));

        setTitleValue("");
        setDueValue("");
        setImportanceValue("urgent_not_important");
        setIsFormExpanded(false);
    };
    const handleTitleFocus = () => {
        setIsFormExpanded(true);
    };

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitleValue(event.target.value);
    };

    const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") handleAdd();
    };

    const handleAddButtonClick = () => {
        if (isFormExpanded) handleAdd();
        else setIsFormExpanded(true);
    };

    const { data: postsData } = useGetPostsQuery();

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

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Список задач
            </Typography>

            <Box component="section" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    placeholder="Добавить задачу..."
                    value={titleValue}
                    onFocus={handleTitleFocus}
                    onChange={handleTitleChange}
                    onKeyDown={handleTitleKeyDown}
                    size="small"
                    fullWidth
                    sx={{ flex: 1 }}
                    slotProps ={{ input: {"aria-label": "Добавить задачу"} }}
                />
                <Button
                    onClick={handleAddButtonClick}
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 44, p: 1 }}
                    aria-label="Добавить"
                    >
                    +
                </Button>
                </Stack>
            </Box>

            {isFormExpanded && (
                <Box component="section" sx={{ mb: 3 }}>
                <TodoForm
                    title={titleValue}
                    onTitleChange={setTitleValue}
                    due={dueValue}
                    onDueChange={setDueValue}
                    importance={importanceValue}
                    onImportanceChange={setImportanceValue}
                    onAdd={handleAdd}
                />
                </Box>
            )}

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
