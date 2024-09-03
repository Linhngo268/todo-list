import { useState } from "react";

export const useInputTodo = (setTodos) => {
  const [inputValue, setInputValue] = useState("");
  const [urgency, setUrgency] = useState("Non-Urgent");
  const [dueDateOption, setDueDateOption] = useState("Today");
  const [customDueDate, setCustomDueDate] = useState("");

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
        const id = Date.now();
        return `"${id}"`;
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
        .then((data) => setTodos((prevTodos) => [...prevTodos, data]));

      setInputValue("");
      setUrgency("Non-Urgent");
      setDueDateOption("Today");
      setCustomDueDate("");
    }
  };

  return {
    inputValue,
    setInputValue,
    urgency,
    setUrgency,
    dueDateOption,
    setDueDateOption,
    customDueDate,
    setCustomDueDate,
    addTodo,
  };
};
