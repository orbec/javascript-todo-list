const Messages = {
  PROJECT_CREATION_SUCCESS: "Project successfully created",
  PROJECT_ALREADY_EXISTS: "Project already exists, please provide other name",
  PROJECT_MISSING_MANDATORY_VALUES:
    "Mandatory fields missing, recheck your input",
  PROJECT_CHANGED_SUCCESSFULLY: "Project successfully changed",
  PROJECT_NOT_FOUND: "Project not found",
  PROJECT_DELETED_SUCCESSFULLY: "Project deleted successfully",
  TASK_NOT_FOUND: "Task not found",
  TASK_DELETED_SUCCESSFULLY: "Task deleted successfully",
  TASK_CREATION_SUCCESS: "Task successfully created",
  TASK_ALREADY_EXISTS: "Task already exists, please provide other name",
  TASK_MISSING_MANDATORY_VALUES: "Mandatory fields missing, recheck your input",
  TASK_CHANGED_SUCCESSFULLY: "Task successfully changed",
};

const Status = {
  TODO: "to do",
  IN_PROGRESS: "in progress",
  DONE: "done",
};

const Priority = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export { Messages, Status, Priority };
