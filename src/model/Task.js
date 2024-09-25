export default class Task {

    title;
    description;
    dueDate;
    priority;
    status;
    constructor (title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = "To Do";
    }

    getTaskTitle (){
        return this.title;
    }

    getTaskDesc() {
        return this.description;
    }

    setTaskDesc(description){
        this.description = description;
    }

    getTaskDueDate() {
        return this.dueDate;
    }

    setTaskDueDate(dueDate){
        this.dueDate = dueDate
    }

    getPriority(){
        return this.priority;
    }

    setPriority(priority){
        this.priority = priority;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }
}