import React from "react";

const AddTodo = ({ inputValue, setInputValue, handleKeyPress, addTodo }) => {
  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={addTodo}>Add</button>
    </>
  );
};

export default AddTodo;
