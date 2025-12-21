import type { FC } from "react";
import TodoItem from "../../TodoItem";
import type { Task } from "../../../entities/model/types";
import { Link } from "react-router-dom";

type Props = {
    task: Task;
};

const TodoListItem: FC<Props> = ({ task }) => {
    return (
        <div>
            <Link to={`/todo/${task.id}`} >
                <TodoItem task={task} />
            </Link>
        </div>
    );
};

export default TodoListItem;
