import type { FC, ChangeEvent } from "react";
import type { Importance } from "../../../entities/model/types";

type Props = {
    title: string;
    onTitleChange: (value: string) => void;
    due: string;
    onDueChange: (value: string) => void;
    importance: Importance;
    onImportanceChange: (value: Importance) => void;
    onAdd: () => void;
};

const TodoForm: FC<Props> = ({
                                 title,
                                 onTitleChange,
                                 due,
                                 onDueChange,
                                 importance,
                                 onImportanceChange,
                                 onAdd,
                             }) => {

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onTitleChange(event.target.value);
    };

    const handleDueChange = (event: ChangeEvent<HTMLInputElement>) => {
        onDueChange(event.target.value);
    };

    const handleImportanceChange = (event: ChangeEvent<HTMLInputElement>) => {
        onImportanceChange(event.target.value as Importance);
    };

    const handleAddClick = () => {
        onAdd();
    };

    return (
        <div>
            <div>
                <label>
                    Задача:
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="название задачи"
                    />
                </label>
            </div>

            <div>
                <label>
                    Сделать до:
                    <input type="date" value={due} onChange={handleDueChange}/>
                </label>
            </div>

            <div>
                <div>Важность:</div>

                <label>
                    <input
                        type="radio"
                        name="importance"
                        checked={importance === "urgent_not_important"}
                        value="urgent_not_important"
                        onChange={handleImportanceChange}
                    />
                    Срочно, но неважно
                </label>

                <label>
                    <input
                        type="radio"
                        name="importance"
                        checked={importance === "urgent_important"}
                        value="urgent_not_important"
                        onChange={handleImportanceChange}

                    />
                    Срочно и важно
                </label>

                <label>
                    <input
                        type="radio"
                        name="importance"
                        checked={importance === "not_urgent_important"}
                        value="urgent_not_important"
                        onChange={handleImportanceChange}

                    />
                    Не срочно, но важно
                </label>

                <label>
                    <input
                        type="radio"
                        name="importance"
                        checked={importance === "not_urgent_not_important"}
                        value="urgent_not_important"
                        onChange={handleImportanceChange}

                    />
                    Не срочно и не важно
                </label>
            </div>

            <div>
                <button onClick={handleAddClick}>Добавить задачу</button>
            </div>
        </div>
    );
};

export default TodoForm;
