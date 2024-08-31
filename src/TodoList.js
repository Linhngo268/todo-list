import React from "react";
import ToDoItem from "./TodoItem";

const ToDoList = ({ todos, toggleComplete, deleteTodo, setTodos }) => {
  return (
    <ul>
      {todos.map((todo, index) => (
        <ToDoItem
          key={index}
          todo={todo}
          index={index}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          setTodos={setTodos}
          todos={todos}
        />
      ))}
    </ul>
  );
};

export default ToDoList;
