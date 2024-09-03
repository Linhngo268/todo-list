import React, { useState } from "react";

const TodoItem = ({ todo, toggleComplete, deleteTodo, setTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedTodo = { ...todo, text: editText };

    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsEditing(false);
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === todo.id ? data : t))
        );
      })
      .catch((error) => console.error('Error updating todo:', error));
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <li className={todo.completed ? "completed" : ""}>
      <div className="task-info">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
        />
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyPress={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <span onClick={handleEdit}>{todo.text}</span>
        )}
      </div>
      <div className="dates">
        {todo.dueDate && (
          <div className="due-date">
            <strong>Due: {todo.dueDate} </strong>
          </div>
        )}
      </div>
      <div className="urgency-level">
        <strong>Urgency: </strong>{todo.urgency}
      </div>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
};

export default TodoItem;
