import React, { useState, useEffect } from "react";

import "./App.css";
import TodoItem from "./TodoItem";
import { useInputTodo } from "./inputTodo";
import { toggleComplete } from "./toggleComplete";
import { deleteTodo } from "./deleteTodo";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
function App() {
  const [todos, setTodos] = useState([]);
  const {
    inputValue,
    setInputValue,
    urgency,
    setUrgency,
    dueDateOption,
    setDueDateOption,
    customDueDate,
    setCustomDueDate,
    addTodo,
  } = useInputTodo(setTodos);

  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const sortTodos = (todos, order) => {
    const urgencyLevels = {
      "Most Urgent": 1,
      "Urgent": 2,
      "Non-Urgent": 3,
    };

    return [...todos].sort((a, b) => {
      return order === "asc"
        ? urgencyLevels[a.urgency] - urgencyLevels[b.urgency]
        : urgencyLevels[b.urgency] - urgencyLevels[a.urgency];
    });
  };
   

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedTodos = sortTodos(todos, sortOrder);

  return (
    <div className="container">
      <h1>Todo List</h1>
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
      <select
        value={dueDateOption}
        onChange={(e) => setDueDateOption(e.target.value)}
      >
        <option value="Today">Today</option>
        <option value="Tomorrow">Tomorrow</option>
        <option value="Custom">Set Custom Due Date</option>
      </select>
      {dueDateOption === "Custom" && (
        <input
          type="date"
          value={customDueDate}
          onChange={(e) => setCustomDueDate(e.target.value)}
        />
      )}

      <button onClick={addTodo}>Add</button>
      <button onClick={handleSort}>
        Sort by Urgency ({sortOrder === "asc" ? "Most Urgent" : "Non-Urgent"})
      </button>
     


      <ul>
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleComplete={() => toggleComplete(todo.id, todos, setTodos)}
            deleteTodo={() => deleteTodo(todo.id, setTodos)}
            setTodos={setTodos}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
