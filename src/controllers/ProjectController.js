import Project from "../model/Project.js";
import { Messages } from "../util/Constants.js";

export default function projectController() {
  const createProject = function (user, projectName, projectDescription) {
    if (projectName !== "" && projectDescription !== "") {
      const projectList = user.projects;
      const existingProject = projectList.filter(
        (element) => element.title === projectName,
      );

      if (existingProject.length === 0) {
        const project = new Project(projectName, projectDescription);
        user.addProject(project);
        return {
          code: 0,
          message: Messages.PROJECT_CREATION_SUCCESS,
          currentProject: project,
        };
      }
      return {
        code: 1,
        message: Messages.PROJECT_ALREADY_EXISTS,
        project: null,
      };
    }
    return {
      code: -1,
      message: Messages.PROJECT_MISSING_MANDATORY_VALUES,
      project: null,
    };
  };

  const selectProject = function (user, projectName) {
    const projectList = user.projects;
    const project = projectList.filter(
      (element) => element.title === projectName,
    );
    if (project.length !== 0) {
      return {
        code: 0,
        message: Messages.PROJECT_CHANGED_SUCCESSFULLY,
        currentProject: project.at(0),
      };
    }
    return {
      code: -1,
      message: Messages.PROJECT_NOT_FOUND,
      currentProject: null,
    };
  };

  const deleteTask = function (project, taskName) {
    const initSize = project.tasks.length;
    project.deleteTask(taskName);

    if (project.tasks.length < initSize) {
      return {
        code: 0,
        message: Messages.TASK_DELETED_SUCCESSFULLY,
        Tasks: project.tasks,
      };
    }
    return {
      code: 1,
      message: Messages.TASK_NOT_FOUND,
      Tasks: project.tasks,
    };
  };

  return {
    createProject,
    selectProject,
    deleteTask,
  };
}
