import "../style.css";
import todoListController from "./TodoListController";
import userImage from "../assets/images/avatar-svgrepo-com.svg";
import projectImg from "../assets/images/folder-share-svgrepo-com.svg";
import { modalConfigurations } from "../util/ModalConfs";

export default function screenController(){

    let tdController;

    let user;
    let currentProject;
    let currentTask;

    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const mainContainer = document.querySelector(".main-container");

    const createFormGroup = (field) => {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        formGroup.classList.add("tooltip");

        const input = document.createElement(field.type === "select" ? "select" : field.type === "textarea" ? "textarea" : "input");
        input.id = field.id;
        input.name = field.name;
        input.placeholder = " ";
        input.required = field.inputType === "checkbox" ? false : true;
        if (field.type === "input" && field.inputType){
            input.type = field.inputType;
        }

        if(field.type === "textarea"){
            input.maxLength = 200;
        }else if(field.type === "input" && field.inputType === "text"){
            input.maxLength = 50;
        }

        if(field.type === "select"){
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.hidden = true;
            input.appendChild(defaultOption);

            field.options.forEach(optionValue => {
                const option = document.createElement("option");
            option.value = optionValue.value;
            option.textContent = optionValue.text;
            input.appendChild(option);
            });
        }

        const label = document.createElement("label");
        label.htmlFor = field.id;
        label.textContent = field.label;

        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip-text");
        tooltip.textContent = field.tooltip;

        formGroup.appendChild(input);
        formGroup.appendChild(label);
        formGroup.appendChild(tooltip);

        return formGroup;
    }

    const submitForm = (event) => {

        const modalId = event.target.parentElement.id;
        const formData = new FormData(event.target);
        
        switch (modalId){
            case "logInModal":
                const userName = formData.get("user-name");
                const defaultProject = formData.get("default-project");
                todoListController(userName).then((data) => {
                    tdController = data;
                    setTimeout(() => {
                        user = tdController.getCurrentUser();
                        if(defaultProject === "on" && user.projects.length === 0){
                            tdController.createProject("default", `Default project for user ${userName}`);
                        }
                        initialize();
                    }, 100);
                    
                });
                break;
            case "logOutModal":
                const clearData = formData.get("clear-data");
                if(clearData === "on"){
                    tdController.clearUser();
                }
                user = tdController.closeUser();
                currentProject = null;
                initialize();
                break;
            case "createPjModal":
                const projectTitle = formData.get("project-title");
                const projectDescription = formData.get("project-description");

                currentProject = tdController.createProject(projectTitle, projectDescription).currentProject;

                setSideBar();
                setContentArea();
                break;
            case "createTaskModal":
                const taskTitle = formData.get("task-title");
                const taskDescription = formData.get("task-description");
                const taskDueDate = formData.get("task-due-date");
                const taskPriority = formData.get("task-priority");

                const objTask = tdController.createTask(taskTitle, taskDescription, taskDueDate, taskPriority);
                currentTask = objTask.currentTask;

                if(currentTask){
                    setTaskLocation(currentTask);
                }
        }

    }

    const createModal = (modalId) => {

        const dialog = document.createElement("dialog");
        const diagConf = modalConfigurations.filter((modalConf) => modalConf.id === modalId);
        const conf = diagConf.at(0);

        if(conf){

            dialog.id = conf.id;

            const modalHeader = document.createElement("h3");
            modalHeader.textContent = conf.header;

            dialog.appendChild(modalHeader);

            const form = document.createElement("form");
            form.method = "dialog";

            conf.fields.forEach(field => {
                form.appendChild(createFormGroup(field));
            });

            const dialogButtons = document.createElement("div");
            dialogButtons.classList.add("dialog-buttons");

            const cancelBtn = document.createElement("button");
            cancelBtn.type = "button";
            cancelBtn.textContent = "Cancel";
            cancelBtn.id = "cancel-button";

            const submitBtn = document.createElement("button");
            submitBtn.type = "submit";
            submitBtn.textContent = "Submit";

            dialogButtons.appendChild(cancelBtn);
            dialogButtons.appendChild(submitBtn);

            form.appendChild(dialogButtons);

            dialog.appendChild(form);
            body.appendChild(dialog);

            cancelBtn.addEventListener("click", (event) => {
                dialog.close();
                dialog.remove();
                
            });

            form.addEventListener("submit", (event) => {
                event.preventDefault();

                submitForm(event);

                dialog.close();
                dialog.remove();
            })

        }
        dialog.showModal();

        
    }

    const initialize = () => {

        mainContainer.innerHTML = "";
        
        setHeader();
        setSideBar();
        setContentArea();

    }

    const setHeader = ()  => {

        header.innerHTML = "";

        const appNameContainer = document.createElement("div");
        const userNameContainer = document.createElement("div");
        const headerAction = document.createElement("div");
        const appName = document.createElement("h2");
        

        userNameContainer.classList.add("user-info");
        headerAction.classList.add("user-action");

        appName.innerHTML = "MyToDo JavaScript App";

        appNameContainer.appendChild(appName);
        header.appendChild(appNameContainer);
        
        if (user){
            const userName = document.createElement("h3");
            const userIcon = document.createElement("img");
            const news = document.createElement("button");
            const logOutBtn = document.createElement("button");
            const tooltipText = document.createElement("span");

            userIcon.src = userImage;
            news.classList.add("notification");
            
            userName.innerHTML = "Welcome, " + user.userName;
            userNameContainer.appendChild(userIcon);
            userNameContainer.appendChild(userName);
            
            
            tooltipText.classList.add("tooltip-text");
            logOutBtn.classList.add("logout");
            tooltipText.innerHTML = "Log Out";
            logOutBtn.appendChild(tooltipText);
            logOutBtn.addEventListener("click", function(e) {
                showHeaderActionModal(e);
            });
            logOutBtn.addEventListener("mouseover", () =>{
                const tooltip = logOutBtn.querySelector(".tooltip-text");
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
            });
            logOutBtn.addEventListener("mouseout", () => {
                const tooltip = logOutBtn.querySelector(".tooltip-text");
                tooltip.style.visibility = "hidden";
                tooltip.style.opacity = "0";
            });
            headerAction.appendChild(news);
            headerAction.appendChild(logOutBtn);
            header.appendChild(userNameContainer);
            header.appendChild(headerAction);
        }else{
            const headerAction = document.createElement("div");
            const logInBtn = document.createElement("button");
            const tooltipText = document.createElement("span");
            tooltipText.classList.add("tooltip-text");
            tooltipText.innerHTML = "Log In";
            logInBtn.classList.add("login");
            logInBtn.appendChild(tooltipText);
            logInBtn.addEventListener("click", function(e) {
                showHeaderActionModal(e);
            });
            logInBtn.addEventListener("mouseover", () =>{
                const tooltip = logInBtn.querySelector(".tooltip-text");
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
            });
            logInBtn.addEventListener("mouseout", () => {
                const tooltip = logInBtn.querySelector(".tooltip-text");
                tooltip.style.visibility = "hidden";
                tooltip.style.opacity = "0";
            });

            headerAction.appendChild(logInBtn);
            header.appendChild(headerAction);

        }
    }

    const setSideBar = () => {

        const sideBar = document.createElement("div");
        sideBar.classList.add("side-bar");

        if(user){
            const addProjectBtn = document.createElement("button");
            const projectTitleContainer = document.createElement("div");
            const projectTitle = document.createElement("h2");
            const pjImg = document.createElement("img");
            const pjList = document.createElement("div");

            pjList.classList.add("project-list");

            const projectList = user.projects;
            

            projectList.map(project => {
                const pjButton = document.createElement("button");
                pjButton.setAttribute("id", project.title);
                if(currentProject && project.title === currentProject.title){
                    pjButton.classList.add("activated");
                }
                pjButton.innerHTML = project.title;
                pjButton.addEventListener("click", (event) => setCurrentProject(event));
                pjList.appendChild(pjButton);
            })
            addProjectBtn.setAttribute("id", "add-project");
            addProjectBtn.innerHTML = "Add Project";
            projectTitleContainer.classList.add("title-container");
            projectTitle.innerHTML = "Projects";
            pjImg.src = projectImg;

            addProjectBtn.addEventListener("click", (event) => {
                showAddprojectModal(event);
            });

            projectTitleContainer.appendChild(pjImg);
            projectTitleContainer.appendChild(projectTitle);
            sideBar.appendChild(addProjectBtn);
            sideBar.appendChild(projectTitleContainer);
            sideBar.appendChild(pjList);
        }
        mainContainer.appendChild(sideBar);

    }

    const setContentArea = () => {

        const contentArea = document.createElement("div");

        if(currentProject){
            const projectContainer = document.createElement("div");
            const projectInfoContainer = document.createElement("div");
            const projectActionContainer = document.createElement("div");
            const projectTitle = document.createElement("h2");
            const projectDescription = document.createElement("p");
            const editProjectBtn = document.createElement("button");
            const deleteProjectBtn = document.createElement("button");

            
            projectActionContainer.appendChild(editProjectBtn);
            projectActionContainer.appendChild(deleteProjectBtn);

            projectContainer.classList.add("project-info");
            editProjectBtn.classList.add("edit");
            deleteProjectBtn.classList.add("delete");
            projectActionContainer.classList.add("action");

            projectTitle.innerHTML = `Project: ${currentProject.title}`;
            projectDescription.innerHTML = currentProject.description;
            projectInfoContainer.appendChild(projectTitle);
            projectInfoContainer.appendChild(projectDescription);

            projectContainer.appendChild(projectInfoContainer);
            projectContainer.appendChild(projectActionContainer);

            const taskContainer = setTasks();

            contentArea.appendChild(projectContainer);
            contentArea.appendChild(taskContainer);


            
        }

        contentArea.classList.add("content-area");
        mainContainer.appendChild(contentArea);

        if(currentProject){
            currentProject.tasks.map((task) => setTaskLocation(task));

        }
    }

    function setTasks(){

        const taskContainer = document.createElement("div");

        const titleContainer = document.createElement("div");
        const taskTitle = document.createElement("h2");
        const taskCreateBtn = document.createElement("button");
        const todoTasks = document.createElement("div");
        const inProgressTasks = document.createElement("div");
        const doneTasks = document.createElement("div")

        taskContainer.classList.add("task-container");
        titleContainer.classList.add("title");
        taskCreateBtn.classList.add("create");
        todoTasks.classList.add("todo");
        inProgressTasks.classList.add("in-progress");
        doneTasks.classList.add("done");

        todoTasks.innerHTML = "To Do";
        inProgressTasks.innerHTML = "In Progress";
        doneTasks.innerHTML = "Done";

        titleContainer.appendChild(taskTitle);
        titleContainer.appendChild(taskCreateBtn);


        taskTitle.innerHTML = "Tasks";
        taskCreateBtn.addEventListener("click", (event) => showAddTaskModel(event));

        taskContainer.appendChild(titleContainer);
        taskContainer.appendChild(todoTasks);
        taskContainer.appendChild(inProgressTasks);
        taskContainer.appendChild(doneTasks);

        return taskContainer;

    }

    function showHeaderActionModal(e){

        const modalOption = e.target.querySelector(".tooltip-text").innerHTML;

        if (modalOption === "Log In"){

            createModal("logInModal");
            document.querySelector("#user-name").value = "guest User";

        }else if (modalOption === "Log Out"){

            createModal("logOutModal");
        }
    }

    function showAddprojectModal(e){

        createModal("createPjModal");
    }

    function showAddTaskModel(e){

        createModal("createTaskModal");

    }

    function setTaskLocation(task){
        
        const taskStatus = task.status;
        console.log(taskStatus);
        let statusContainer;
        switch(taskStatus){
            case "to do":
                statusContainer = document.querySelector(".todo");
                break;
            case "in progress":
                statusContainer = document.querySelector(".in-progress");
                break;
            case "done":
                statusContainer = document.querySelector(".done");
        }

        const taskDiv = document.createElement("div");
        taskDiv.innerHTML = `${task.title}, ${task.description}, ${task.dueDate}, ${task.priority}, ${task.status}`;
        statusContainer.appendChild(taskDiv);


    }

    function getCurrentUser(){
        return user;
    }

    function getUser(userName){
        tdController.getUser(userName);
    }

    function setCurrentProject(event){
        currentProject = tdController.selectProject(event.target.id).currentProject;
        mainContainer.innerHTML = "";
        setSideBar();
        setContentArea();
    }

    return {
        initialize,
        getCurrentUser,
        getUser,
    }

    

    
}