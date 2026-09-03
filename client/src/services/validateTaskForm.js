export const FORM_ERROR_MESSAGE =
  "Please fill in all fields, including the description, before creating the task.";

// Pure guard for the Create Task form: returns an error message when any
// required field is blank, otherwise null. Extracted so it can be unit
// tested without rendering the component.
export const validateTaskForm = ({
  title,
  assignedTo,
  dueDate,
  category,
  priority,
  description,
}) => {
  if (
    !title?.trim() ||
    !assignedTo ||
    !dueDate ||
    !category ||
    !priority ||
    !description?.trim()
  ) {
    return FORM_ERROR_MESSAGE;
  }
  return null;
};
