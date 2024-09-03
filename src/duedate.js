export const determineDueDate = (dueDateOption, customDueDate) => {
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
    return dueDate;
  };
  