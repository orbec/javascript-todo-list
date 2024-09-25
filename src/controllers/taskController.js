import Task from "../model/Task.js";
import Project from "../model/Project.js";

const TASK_CREATION_SUCCESS = "Task successfully created";
const TASK_ALREADY_EXISTS = "Task already exists, please provide other name";
const TASK_MISSING_MANDATORY_VALUES = "Mandatory fields missing, recheck your input";
const TASK_CHANGED_SUCCESSFULLY = "Task successfully changed";
const TASK_NOT_FOUND = "Task not found";
const TASK_DELETED_SUCCESSFULLY = "Task deleted successfully";

export default function TaskController(){

    const createTask = function(project,TaskName, TaskDescription, taskDueDate, taskPriority) {

        let pj = new Project();
        if(!(project instanceof Project)){
            Object.assign(pj,project);
            project = pj;
        }
        if (TaskName !== "" && TaskDescription !== "" && taskDueDate !== null && taskPriority !== null){
            
            const taskList = project.getTaskList();
            const existingTask = taskList.filter(element => {
                let task = new Task();
                if(!(element instanceof Task)){
                    Object.assign(task, element);
                    
                }else{
                    task = element;
                }
                if (task.getTaskTitle() === TaskName){
                    return task;
                }
            });
                
            
            if (existingTask.length === 0){
                const task = new Task(TaskName, TaskDescription, taskDueDate, taskPriority);
                project.addTask(task);
                return {
                    code: 0,
                    message: TASK_CREATION_SUCCESS,
                    currentTask: task
                };
            }
            return {
                code: 1,
                message: TASK_ALREADY_EXISTS,
                Task: null
            };

            
        }
        return {
            code: -1,
            message: TASK_MISSING_MANDATORY_VALUES,
            Task: null
        };
        
    }

    const selectTask = function (project, TaskName) {

        let pj = new Project();
        if(!(project instanceof Project)){
            Object.assign(pj,project);
            project = pj;
        }
        const taskList = project.getTaskList();
        const task = taskList.filter(element => {
            let task = new Task();
            if(!(element instanceof Task)){
                Object.assign(task,element)
            }else{
                task = element
            }
            if(task.getTaskTitle() === TaskName){
                return task;
            }
                
        });
        if (task.length !== 0){
            return {
                code: 0,
                message: TASK_CHANGED_SUCCESSFULLY,
                currentTask: task.at(0)
            };
        }
        return {
            code: -1,
            message: TASK_NOT_FOUND,
            currentTask: null
        }
        
    }

    const deleteTask = function(project,taskName) {

        let pj = new Project();
        if(!(project instanceof Project)){
            Object.assign(pj,project);
            project = pj;
        }
        const taskList = project.getTaskList();

        const task = taskList.filter(element => {
            let task = new Task();
            if (!(element instanceof Task)){
                Object.assign(task,element);
            }else{
                task = element;
            }
            if(task.getTaskTitle() !== taskName){
                return task;
            }
            
        });

        if (task.length < taskList.length){
            return {
                code: 0,
                message: TASK_DELETED_SUCCESSFULLY,
                Tasks: task
            }
        }
        return{
            code: 1,
            message: TASK_NOT_FOUND,
            Tasks: task
        }
        
    }

    return {
        createTask,
        selectTask,
        deleteTask,
    }

}