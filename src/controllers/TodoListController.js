import { storageAvailable, storeData, retrieveData, clearStorage } from "./StorageController.js";
import { genIv, genKey, encrypt, decrypt, exportKey, importKey } from "../util/Encryption.js";

import User from "../model/User.js";
import ProjectController from "./ProjectController.js"
import TaskController from "./TaskController.js";

export default async function todoListController(userName) {

    let user = new User(userName);
    const pjController = ProjectController();
    const taskController = TaskController();
    let currentProject;
    let currentTask;

    const store = function (storageName, data) {
        if (storageAvailable("localStorage")) {
            storeData(storageName, data);
        }
    }

    const retrieve = function (storageName) {
        if (storageAvailable("localStorage")) {
            return retrieveData(storageName);
        }
        return null;
    }

    async function getKeyAndIv(){

        const ivFromStorage = retrieve("iv");
        const keyFromStorage = retrieve("key");

        const i = await genIv();
        const k = await exportKey(await genKey());
        if (!ivFromStorage){
            store("iv", JSON.stringify(Array.from(i)));
        }
        if(!keyFromStorage){
            store("key",JSON.stringify(k));
        }
        return {
            iv: new Uint8Array(JSON.parse(retrieve("iv") || "")),
            key: await importKey(JSON.parse(retrieve("key") || "")),
        };
    }

    const {iv, key} = await getKeyAndIv();

    async function getUser(userName){

        if (userName.length !== 0) {

            const userFromStorage = retrieve(userName) || "";
            if (!userFromStorage) {
                await saveUser();
            }
            user = await getUserFromStorage();
        }
    }

    getUser(userName);

    async function saveUser() {
        const encryptedUser = await encrypt(key, iv, user);
        store(userName, JSON.stringify(Array.from(new Uint8Array(encryptedUser))));
    }

    async function getUserFromStorage() {

        const encryptedUser = new Uint8Array(JSON.parse(retrieve(userName) || ""));
        const decryptedUser = await decrypt(key,iv,encryptedUser);
        return User.fromJSON(decryptedUser);

    }

    

    const createProject = function (projectName, projectDescription) {

        if (user) {
            const objProject = pjController.createProject(user, projectName, projectDescription);
            currentProject = objProject.currentProject;
            if (currentProject) {
                saveUser();
            }
            return objProject;
        }
        return null;


    }

    const selectProject = function (projectName) {

        if (user) {
            const objProject = pjController.selectProject(user, projectName);
            const lastProject = currentProject;
            currentProject = objProject.currentProject;
            if (currentProject) {
                return objProject;
            }
            objProject.currentProject = lastProject;
            return objProject;
        }
        return null;

    }

    const deleteProject = function () {

        if (user && currentProject) {
            const objProject = pjController.deleteProject(user, currentProject.title);
            currentProject = null;
            user.projects = objProject.projects;
            saveUser();
            return objProject;
        }
        return null;

    }

    const updateProject = (newDescription) => {

        if (currentProject) {
            currentProject.description = newDescription;
            saveUser();
            return user;
        }
        return null;


    }

    const createTask = function (taskName, taskDescription, taskDueDate, taskPriority) {

        if (user && currentProject) {
            const objTask = taskController.createTask(currentProject, taskName, taskDescription, taskDueDate, taskPriority);
            currentTask = objTask.currentTask;
            if (currentTask) {
                saveUser();
            }
            return objTask;
        }
        return null;

    }

    const selectTask = function (taskName) {

        if (user && currentProject) {
            const objTask = taskController.selectTask(currentProject, taskName);
            const lastTask = currentTask;
            currentTask = objTask.currentTask;
            if (currentTask) {
                return objTask;
            }
            objTask.currentTask = lastTask;
            return objTask;
        }
        return null;

    }

    const deleteTask = function () {

        if (user && currentProject && currentTask) {
            const objTask = pjController.deleteTask(currentProject, currentTask.title);
            currentTask = null;
            saveUser();
            return objTask;
        }
        return null;

    };

    const updateTask = (newDescription, newDueDate, newPriority, newStatus) => {
        if (currentTask && currentProject) {
            currentTask.description = newDescription;
            currentTask.dueDate = newDueDate;
            currentTask.priority = newPriority;
            currentTask.status = newStatus;
            saveUser();
            return user;
        }
        return null;
    }

    const getCurrentUser = () => {
        if (user) {
            return user;
        }
        return null;
    };

    const getCurrentProject = () => {
        if (currentProject) {
            return currentProject;
        }
        return null;

    };

    const getCurrentTask = () => {
        if (currentTask) {
            return currentTask;
        }
        return null;

    };

    const clearUser = () => {
        user.projects = [];
        saveUser();
    }

    const closeUser = () => {
        user = null;
    }

    return {
        createProject,
        selectProject,
        getCurrentUser,
        getCurrentProject,
        clearUser,
        deleteProject,
        createTask,
        selectTask,
        deleteTask,
        updateProject,
        updateTask,
        closeUser,
        getUser,

    }

}


