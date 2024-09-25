import Project from "./Project";
export default class User {

    userName;
    projectList = [];

    constructor(userName){
        this.userName = userName;
    }

    getuserName(){
        return this.userName;
    }

    getProjectList(){
        return this.projectList;
    }

    addProject(project){
        this.projectList.push(project);
    }

    setProjectList(projectList){
        this.projectList = projectList;
    }
}