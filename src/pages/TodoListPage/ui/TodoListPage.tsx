import type { FC, ChangeEvent, KeyboardEvent } from "react";
import { useState } from "react";
import TodoForm from "../../../widgets/TodoForm";
import TodoListItem from "../../../widgets/TodoListItem";
import type { Task, Importance } from "../../../entities/model/types";
import { v4 as uuidv4 } from "uuid";

const TodoListPage: FC = () => {
    const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
    const [titleValue, setTitleValue] = useState<string>("");
    const [dueValue, setDueValue] = useState<string>("");
    const [importanceValue, setImportanceValue] = useState<Importance>("urgent_not_important");
    const [tasks, setTasks] = useState<Task[]>([]);

    const handleAdd = () => {
        const trimmedTitle = titleValue.trim();
        if (!trimmedTitle) return;

        const newTask: Task = {
            id: uuidv4(),
            title: trimmedTitle,
            due: dueValue || undefined,
            importance: importanceValue,
        };

        setTasks((previous) => [newTask, ...previous]);

        setTitleValue("");
        setDueValue("");
        setImportanceValue("urgent_not_important");
        setIsFormExpanded(false);
    };
    const handleTitleFocus = () => {
        setIsFormExpanded(true);
    };

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setTitleValue(event.target.value);
    };

    const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") handleAdd();
    };

    const handleAddButtonClick = () => {
        if (isFormExpanded) handleAdd();
        else setIsFormExpanded(true);
    };

    return (
        <div>
            <h1>Список задач</h1>

            <div>
                <input
                    placeholder="Добавить задачу..."
                    value={titleValue}
                    onFocus={handleTitleFocus}
                    onChange={handleTitleChange}
                    onKeyDown={handleTitleKeyDown}
                />
                <button onClick={handleAddButtonClick}>+</button>
            </div>

            {isFormExpanded && (
                <TodoForm
                    title={titleValue}
                    onTitleChange={setTitleValue}
                    due={dueValue}
                    onDueChange={setDueValue}
                    importance={importanceValue}
                    onImportanceChange={setImportanceValue}
                    onAdd={handleAdd}
                />
            )}

            <div>
                {tasks.length === 0 ? (
                    <div>Список пуст — добавьте задачу</div>
                ) : (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <TodoListItem task={task} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TodoListPage;
