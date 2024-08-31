import React, { useState } from "react";

const ToDoItem = ({ todo, index, toggleComplete, deleteTodo, setTodos, todos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    const newTodos = [...todos];
    newTodos[index].text = editText;
    setTodos(newTodos);
    setIsEditing(false);
  };

  const handleBlur = () => handleSave();

  return (
    <li className={todo.completed ? "completed" : ""}>
      <div className="task-info">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(index)}
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
        <strong>Urgency: </strong>
        {todo.urgency}
      </div>
      <button onClick={() => deleteTodo(index)}>Delete</button>
    </li>
  );
};

export default ToDoItem;
