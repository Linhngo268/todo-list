import React, { useState } from "react";
// editable items 
function TodoItem({ todo, toggleComplete, deleteTodo, setTodos }) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || "");

  const [isEditingUrgency, setIsEditingUrgency] = useState(false);
  const [editUrgency, setEditUrgency] = useState(todo.urgency);

  const handleEditText = () => {
    setIsEditingText(true);
  };

  const handleEditDueDate = () => {
    setIsEditingDueDate(true);
  };

  const handleEditUrgency = () => {
    setIsEditingUrgency(true);
  };

  const handleSave = () => {
    const updatedTodo = {
      ...todo,
      text: editText,
      dueDate: editDueDate,
      urgency: editUrgency,
    };

    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsEditingText(false);
        setIsEditingDueDate(false);
        setIsEditingUrgency(false);
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === todo.id ? data : t))
        );
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const handleBlur = () => {
    handleSave();
  };
   
  return (
    <li className={todo.completed ? "completed" : ""}>
      <div className="task-info">
        <input
        id='check-box'
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
           
        />
        {isEditingText ? (
          <input
           type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyPress={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <span onClick={handleEditText}>{todo.text}</span>
        )}
      </div>

      <div className="dates">
        {isEditingDueDate ? (
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            onBlur={handleBlur}
            onKeyPress={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <span onClick={handleEditDueDate}>
            <strong>Due: {todo.dueDate} </strong>
          </span>
        )}
      </div>

      <div className="urgency-level">
        {isEditingUrgency ? (
          <select
            value={editUrgency}
            onChange={(e) => setEditUrgency(e.target.value)}
            onBlur={handleBlur}
            autoFocus
          >
            <option value="Non-Urgent">Non-Urgent</option>
            <option value="Urgent">Urgent</option>
            <option value="Most Urgent">Most Urgent</option>
          </select>
        ) : (
          <span onClick={handleEditUrgency}>
            <strong>Urgency: </strong>{todo.urgency}
          </span>
        )}
      </div>

      <button onClick={() => deleteTodo(todo.id)}>
        Close {/* FontAwesome Trash Icon */}
      </button>
    </li>
  );
}

export default TodoItem;
