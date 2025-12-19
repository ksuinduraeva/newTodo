import type { FC } from "react";
import TodoItem from "../../TodoItem";
import type { Task } from "../../../entities/model/types";

type Props = {
    task: Task;
};

const TodoListItem: FC<Props> = ({ task }) => {
    return (
        <div>
            <TodoItem task={task} />
        </div>
    );
};

export default TodoListItem;
