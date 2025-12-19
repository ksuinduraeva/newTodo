import type { FC } from "react";
import TodoListPage from "./pages/TodoListPage";
import TodoDetails from "./pages/TodoDetails";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TodoListPage />} />
                <Route path="/todo/:id" element={<TodoDetails />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
