import React from "react";

const DatePicker = ({ dueDateOption, setDueDateOption, customDueDate, setCustomDueDate }) => {
  return (
    <>
      <select value={dueDateOption} onChange={(e) => setDueDateOption(e.target.value)}>
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
    </>
  );
};

export default DatePicker;
