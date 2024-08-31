import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [urgency, setUrgency] = useState("Non-Urgent");

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        text: inputValue,
        completed: false,
        createdDate: new Date().toLocaleString(),
        finishedDate: null,
        urgency: urgency,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
      setUrgency("Non-Urgent"); //default
    }
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    const todo = newTodos[index];
    todo.completed = !todo.completed;
    todo.finishedDate = todo.completed ? new Date().toLocaleString() : null;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
        <option value="Non-Urgent">Non-Urgent</option>
        <option value="Urgent">Urgent</option>
        <option value="Most Urgent">Most Urgent</option>
      </select>
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo, index) => (
          <ToDoItem
            key={index}
            todo={todo}
            index={index}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}

const ToDoItem = ({ todo, index, toggleComplete, deleteTodo }) => (
  <li className={todo.completed ? "completed" : ""}>
    <div className="task-info">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(index)}
      />
      <span>{todo.text}</span>
    </div>
    <div className="dates">
      <div className="created-date">Created: {todo.createdDate}</div>
      {todo.finishedDate && (
        <div className="finished-date">Finished: {todo.finishedDate}</div>
      )}
    </div>
    <div className="urgency-level">
      <strong>Urgency: </strong>{todo.urgency}
    </div>
    <button onClick={() => deleteTodo(index)}>Delete</button>
  </li>
);


export default App;
