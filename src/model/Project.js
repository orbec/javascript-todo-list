export default class Project {

    title;
    description;
    taskList = [];

    constructor (title,description) {
        this.title = title;
        this.description = description;
    }

    getProjectTitle() {
        return this.title
    }

    getProjectDescription() {
        return this.description
    }

    setProjectDescription(description){
        this.description = description;
    }

    getTaskList() {
        return this.taskList;
    }

    addTask(task) {
        this.taskList.push(task);
    }

    setTaskList(taskList) {

        this.taskList = taskList;
    }

}