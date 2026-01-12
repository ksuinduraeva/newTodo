import type { FC } from "react";
import TodoItem from "../../TodoItem";
import type { Task } from "../../../entities/model/types";
import { Box } from "@mui/material";

type Props = {
    task: Task;
};

const TodoListItem: FC<Props> = ({ task }) => {
        return (
            <Box component="li" sx={{ mb: 1, listStyle: "none" }}>
                    <TodoItem task={task} />
            </Box>
        );
    };
export default TodoListItem;
