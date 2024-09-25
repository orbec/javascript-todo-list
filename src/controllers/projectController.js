import Project from "../model/Project.js";

const PROJECT_CREATION_SUCCESS = "Project successfully created";
const PROJECT_ALREADY_EXISTS = "Project already exists, please provide other name";
const PROJECT_MISSING_MANDATORY_VALUES = "Mandatory fields missing, recheck your input";
const PROJECT_CHANGED_SUCCESSFULLY = "Project successfully changed";
const PROJECT_NOT_FOUND = "Project not found";
const PROJECT_DELETED_SUCCESSFULLY = "Project deleted successfully";

export default function projectController(){

    const createProject = function(user,projectName, projectDescription) {

        if (projectName !== "" && projectDescription !== ""){
            
            const projectList = user.getProjectList();
            const existingProject = projectList.filter(element => {
                let project = new Project("","");
                if(!(element instanceof Project)){
                    Object.assign(project, element);
                    
                }else{
                    project = element;
                }
                if (project.getProjectTitle() === projectName){
                    return project;
                }
            });
                
            
            if (existingProject.length === 0){
                const project = new Project(projectName, projectDescription);
                const projects = user.addProject(project);
                return {
                    code: 0,
                    message: PROJECT_CREATION_SUCCESS,
                    currentProject: project
                };
            }
            return {
                code: 1,
                message: PROJECT_ALREADY_EXISTS,
                project: null
            };

            
        }
        return {
            code: -1,
            message: PROJECT_MISSING_MANDATORY_VALUES,
            project: null
        };
        
    }

    const selectProject = function (user, projectName) {
        const projectList = user.getProjectList();
        const project = projectList.filter(element => {
            let project = new Project("","");
            if(!(element instanceof Project)){
                Object.assign(project,element)
            }else{
                project = element
            }
            if(project.getProjectTitle() === projectName){
                return project;
            }
                
        });
        if (project.length !== 0){
            return {
                code: 0,
                message: PROJECT_CHANGED_SUCCESSFULLY,
                currentProject: project.at(0)
            };
        }
        return {
            code: -1,
            message: PROJECT_NOT_FOUND,
            currentProject: null
        }
        
    }

    const deleteProject = function(user,projectName) {
        const projectList = user.getProjectList();

        const project = projectList.filter(element => {
            let project = new Project("","");
            if (!(element instanceof Project)){
                Object.assign(project,element);
            }else{
                project = element;
            }
            if(project.getProjectTitle() !== projectName){
                return project;
            }
            
        });

        if (project.length < projectList.length){
            return {
                code: 0,
                message: PROJECT_DELETED_SUCCESSFULLY,
                projects: project
            }
        }
        return{
            code: 1,
            message: PROJECT_NOT_FOUND,
            projects: project
        }
        
    }

    return {
        createProject,
        selectProject,
        deleteProject,
    }

}