import React, { useState, useEffect } from "react";
import "./App.css";
//check hoe to make id in the ""
function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [urgency, setUrgency] = useState("Non-Urgent");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dueDateOption, setDueDateOption] = useState("Today");
  const [customDueDate, setCustomDueDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const addTodo = () => {
    if (inputValue.trim()) {
      let dueDate;
      switch (dueDateOption) {
        case "Today":
          dueDate = new Date().toLocaleDateString();
          break;
        case "Tomorrow":
          dueDate = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString();
          break;
        case "Custom":
          dueDate = customDueDate;
          break;
        default:
          dueDate = null;
      }
      const generateId = () => {
        const id =  Date.now(); // Generate a random ID (you can use any method here)
        return `"${id}"`; // Wrap the ID in quotes
      };
      const newTodo = {
        id: generateId(),
        text: inputValue,
        completed: false,
        urgency: urgency,
        dueDate: dueDate,
      };

      fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((response) => response.json())
        .then((data) => setTodos([...todos, data]));

      setInputValue("");
      setUrgency("Non-Urgent");
      setDueDateOption("Today");
      setCustomDueDate("");
    }
  };

const toggleComplete = (id) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
  
    if (updatedTodo) {
      const updatedTodoData = { ...updatedTodo, completed: !updatedTodo.completed };
  
      // Update the state locally
      const newTodos = todos.map((todo) => 
        todo.id === id ? updatedTodoData : todo
      );
      setTodos(newTodos);
  
      // Make a PUT request to update the todo item on the server
      fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodoData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          console.log(id); 
        })
        .catch((error) => {
          console.error('Error:', error);
          console.log(id); 
        });
    }
  };
  
  
    

  const deleteTodo = (id) => {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    })
    .catch((error) => console.error('Error deleting todo:', error));
};
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
          <ToDoItem
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            setTodos={setTodos}
          />
        ))}
      </ul>
    </div>
  );
}

const ToDoItem = ({ todo, toggleComplete, deleteTodo,setTodos }) => {
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

export default App;
