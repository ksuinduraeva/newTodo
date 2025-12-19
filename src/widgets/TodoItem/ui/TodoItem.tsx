import type { FC } from "react";
import type { Task } from "../../../entities/model/types";

type Props = {
    task: Task;
};

const InportanceLabels: Record<Task["importance"], string> = {
    urgent_not_important: "Срочно, но неважно",
    urgent_important: "Срочно и важно",
    not_urgent_important: "Не срочно, но важно",
    not_urgent_not_important: "Не срочно и не важно",
};

const TodoItem: FC<Props> = ({ task }) => {
    return (
        <div>
            <div>
                <strong>{task.title}</strong>
            </div>
            <div>{task.due ?? "Срок не указан"}</div>
            <div>{InportanceLabels[task.importance]}</div>
        </div>
    );
};

export default TodoItem;
