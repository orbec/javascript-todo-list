import { Messages } from "../util/Constants";

export default function userController() {

    const deleteProject = function (user, projectName) {

        const initsize = user.projects.length;

        user.deleteProject(projectName);

        if (user.projects.length < initsize) {
            return {
                code: 0,
                message: Messages.PROJECT_DELETED_SUCCESSFULLY,
                projects: user.projects
            }
        }
        return {
            code: 1,
            message: Messages.PROJECT_NOT_FOUND,
            projects: user.projects
        }

    }

    return {
        deleteProject,
    }

}