import type { FC } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Task } from "../../../entities/model/types";
import { useAppSelector } from "../../../shared/providers/store/hooks";

const TodoDetails: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const task = useAppSelector((state) =>
        id ? state.tasks?.items?.find((it) => it.id === id) ?? null : null
    ) as Task | null;

    return (
        <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
            <h1>Детали задачи</h1>

            <p><strong>ID:</strong> {id ?? "—"}</p>

            {task && (
                <div>
                    <p><strong>Название:</strong> {task.title}</p>
                    <p><strong>Срок:</strong> {task.due ?? "не указан"}</p>
                    <p><strong>Важность:</strong> {task.importance}</p>
                </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => navigate(-1)}>Назад</button>
                <Link to="/"><button>К списку задач</button></Link>
            </div>
        </div>
    );
};

export default TodoDetails;
