import { Priority } from "../util/Constants";

const modalConfigurations = [
    {
        id:"logInModal",
        title: "LogIn Modal",
        header: "Provide a user name, default 'guest User'",
        fields: [
            {type: "input", id:"user-name", name:"user-name", label:"User Name", tooltip:"Enter the user's name", inputType:"text"},
            {type: "input", id:"default-project", name:"default-project", label:"Do you want to include a default project? This only works if you are a new user", tooltip:"Default project?", inputType:"checkbox"},
        ]
    },
    {
        id:"logOutModal",
        title: "LogOut Modal",
        header: "Are you sure you want to Quit?",
        fields: [
            {type: "input", id:"clear-data", name:"clear-data", label:"Do you want to clear your personal data?", tooltip:"Clear your data?", inputType:"checkbox"},
        ]
    },
    {
        id:"createPjModal",
        title: "Create Project Modal",
        header: "Provide a Project's name and a Description",
        fields: [
            {type: "input", id:"project-title", name:"project-title", label:"Project Title", tooltip:"Enter the project's title", inputType:"text"},
            {type: "textarea", id:"project-description", name:"project-description", label:"Project Description", tooltip:"Enter the project's description"},
        ]
    },
    {
        id:"createTaskModal",
        title: "Create Task Modal",
        header: "Provide the Task information",
        fields: [
            {type: "input", id:"task-title", name:"task-title", label:"Task Title", tooltip:"Enter the task's title", inputType:"text"},
            {type: "textarea", id:"task-description", name:"task-description", label:"Task Description", tooltip:"Enter the task's description"},
            {type: "input", id:"task-due-date", name:"task-due-date", label:"Due Date", tooltip:"Enter the task due date", inputType:"date"},
            {type: "select", id:"task-priority", name:"task-priority", label:"Priority", tooltip:"Select the task priority", options: [{text: "Low", value: Priority.LOW},{text:"Medium", value: Priority.MEDIUM},{text:"High", value: Priority.HIGH}]},
        ]
    },
];

export {
    modalConfigurations,
}