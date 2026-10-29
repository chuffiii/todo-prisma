import { useState, useEffect } from "react"
import { api } from "../api";

const Todo = () => {
    interface Todo {
        id: number,
        title: string,
        description: string,
        completed: boolean
    }

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true)
    const [todos, setTodos] = useState<Todo[]>([])

    useEffect(() => {

        const fetchedTodo = async () => {
            const result = await api.get('/todos');
            setTodos(result.data.todos)
            setLoading(false);
        }
        fetchedTodo();
    }, [])

    async function CompleteTodo(id: number) {
        try {
            const res = await api.patch(`/todos/${id}/complete`);

            if (res.data.message === "success") {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === id
                            ? { ...todo, completed: true }
                            : todo
                    )
                );
            }
        } catch (error) {
            console.error("Error completing todo:", error);
        }
    }

    async function DeleteTodo(id: number) {
        try {
            const res = await api.delete(`/todos/${id}`);

            if (res.data.message === "success") {
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo.id !== id)
                );
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    }

    async function AddTodo(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("Form submitted");

        const res = await api.post('/todos', {
            title,
            description
        });

        if (res.data.message === "success") {
            alert('todo created')
            setTitle("")
            setDescription("")
        }
        const newTodo = res.data.todo;
        return newTodo;
    }

    return (
        <div className="flex flex-col">
            <div className="w-full text-center font-bold text-2xl m-5">
                To Do App
            </div>
            <div className="flex justify-center">
                <form onSubmit={AddTodo}>
                    <input className="border border-blue-400 p-1" type="text" placeholder="Enter title" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
                    <input className="border border-blue-400 p-1" type="text" placeholder="Enter description" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
                    <button className="bg-blue-400 p-1 rounded-md" type="submit">Add Todo</button>
                </form>
            </div>

            <div className="w-200 mx-auto m-7">
                {/* Headings */}
                <div className="flex border-b-2 font-bold p-3">
                    <div className="w-1/4">Title</div>
                    <div className="w-1/4">Description</div>
                    <div className="w-1/4">Status</div>
                    <div className="w-1/4">Actions</div>
                </div>

                {/* Todo rows */}
                {loading ? (
                    <div>Loading Todos...</div>
                ) : (
                    todos?.map((todo) => (
                        <div key={todo.id} className="flex items-center border-b p-3">
                            <div className="w-1/4">{todo.title}</div>

                            <div className="w-1/4">{todo.description}</div>

                            <div className="w-1/4">
                                {todo.completed ? (
                                    <span className="text-green-600">Completed</span>
                                ) : (
                                    <span className="text-orange-500">Pending</span>
                                )}
                            </div>

                            <div className="w-1/4 flex gap-2">
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={() => CompleteTodo(todo.id)}
                                    disabled={todo.completed}
                                >
                                    Complete
                                </button>

                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => DeleteTodo(todo.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}



export default Todo