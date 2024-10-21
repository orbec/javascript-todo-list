import Task from "../model/Task.js";
import { Messages } from "../util/Constants.js";

export default function TaskController() {
  const createTask = function (
    project,
    taskName,
    taskDescription,
    taskDueDate,
    taskPriority,
  ) {
    if (
      taskName !== "" &&
      taskDescription !== "" &&
      taskDueDate !== null &&
      taskPriority !== null
    ) {
      const taskList = project.tasks;
      const existingTask = taskList.filter(
        (element) => element.title === taskName,
      );
      if (existingTask.length === 0) {
        const task = new Task(
          taskName,
          taskDescription,
          taskDueDate,
          taskPriority,
        );
        project.addTask(task);
        return {
          code: 0,
          message: Messages.TASK_CREATION_SUCCESS,
          currentTask: task,
        };
      }
      return {
        code: 1,
        message: Messages.TASK_ALREADY_EXISTS,
        Task: null,
      };
    }
    return {
      code: -1,
      message: Messages.TASK_MISSING_MANDATORY_VALUES,
      Task: null,
    };
  };

  const selectTask = function (project, taskName) {
    const taskList = project.tasks;
    const task = taskList.filter((element) => element.title === taskName);
    if (task.length !== 0) {
      return {
        code: 0,
        message: Messages.TASK_CHANGED_SUCCESSFULLY,
        currentTask: task.at(0),
      };
    }
    return {
      code: -1,
      message: Messages.TASK_NOT_FOUND,
      currentTask: null,
    };
  };

  return {
    createTask,
    selectTask,
  };
}
