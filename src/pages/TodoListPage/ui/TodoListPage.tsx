import type { FC, ChangeEvent, KeyboardEvent } from "react";
import { useState } from "react";
import TodoForm from "../../../widgets/TodoForm";
import TodoListItem from "../../../widgets/TodoListItem";
import type { Task, Importance } from "../../../entities/model/types";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../shared/providers/store/hooks";
import { addTask } from "../../../entities/model/slice";



const TodoListPage: FC = () => {
    const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
    const [titleValue, setTitleValue] = useState<string>("");
    const [dueValue, setDueValue] = useState<string>("");
    const [importanceValue, setImportanceValue] = useState<Importance>("urgent_not_important");

    const tasks = useAppSelector((state) => state.tasks.items);
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
                    <div>Список пуст</div>
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
