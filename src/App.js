import React, { useState, useEffect } from "react";
 

import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [urgency, setUrgency] = useState("Non-Urgent");
  const [sortOrder, setSortOrder] = useState("asc"); // state for sorting by urgency
  const[dueDateOption,setDueDateOption]=useState("Today");
  const [customDueDate, setCustomDueDate] = useState(""); //state for due date

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
  const urgencyLevels = {
    "Most Urgent": 1,
    "Urgent": 2,
    "Non-Urgent": 3,
  };
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
      const newTodo = {
       id: Date.now(),
        text: inputValue,
        completed: false,
        urgency: urgency,
        dueDate:dueDate,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
      setUrgency("Non-Urgent"); // Reset urgency to default
      setDueDateOption("Today");
      setCustomDueDate("");
    }
  };

  // const toggleComplete = (id) => {
  //   const newTodos = [...todos];
  //   const todo = newTodos[id];
  //   todo.completed = !todo.completed;
  //   // todo.finishedDate = todo.completed ? new Date().toLocaleString() : null;
  //   setTodos(newTodos);
     
     
  // };
  const toggleComplete = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
  
    setTodos(newTodos);
  };
  

  const deleteTodo = (id) => {
    const newTodos = todos.filter((_, i) => i !== id);
    setTodos(newTodos);
     
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };
  const sortTodos = (todos, order) => {
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
   

  // Function to check if the selected date is valid
   
   

   

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
        {/* {todos.map((todo, id) => (
          <ToDoItem
            todo={todo}
            id={id}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo} 
            setTodos={setTodos}
            todos={todos}
          />
        ))} */}

{sortedTodos.map((todo) => (
    <ToDoItem
      key={todo.id} // Use the unique `id` as the key
      todo={todo}
       
      toggleComplete={toggleComplete}
      deleteTodo={deleteTodo}
      setTodos={setTodos}
      todos={todos}
    />
  ))}
      </ul>
    </div>
  );
}

const ToDoItem = ({ todo, id, toggleComplete, deleteTodo, setTodos, todos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const newTodos = [...todos];
    newTodos[id].text = editText;
    setTodos(newTodos);
    setIsEditing(false);
    
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
        {/* <div className="created-date">Created: {todo.createdDate}</div>
        {todo.finishedDate && (
          <div className="finished-date">Finished: {todo.finishedDate}</div>
        )} */}
        {todo.dueDate && (
          <div className="due-date"><strong>Due: {todo.dueDate} </strong></div>
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
