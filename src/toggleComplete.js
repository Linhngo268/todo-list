export const toggleComplete = (id, todos, setTodos) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
  
    if (updatedTodo) {
      const updatedTodoData = { ...updatedTodo, completed: !updatedTodo.completed };
  
      const newTodos = todos.map((todo) =>
        todo.id === id ? updatedTodoData : todo
      );
      setTodos(newTodos);
  
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
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };
  