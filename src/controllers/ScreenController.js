import "../style.css";
import todoListController from "./TodoListController";
import userImage from "../assets/images/avatar-svgrepo-com.svg";
import projectImg from "../assets/images/folder-share-svgrepo-com.svg";
import highImg from "../assets/images/high-priority-svgrepo-com.svg";
import mediumImg from "../assets/images/medium-priority-svgrepo-com.svg";
import lowImg from "../assets/images/low-priority-svgrepo-com.svg";
import { modalConfigurations } from "../util/ModalConfs";
import { tooltipConfigurations } from "../util/TooltipConfs";

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
    };

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
            case "editPjModal":
                currentProject.description = formData.get("project-description");
                tdController.updateProject(currentProject);
                document.querySelector(".project-info").querySelector("p").textContent = currentProject.description;
                break;
            case "deletePjModal":
                tdController.deleteProject(currentProject);
                currentProject = null;
                initialize();
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
                break;
            case "ediTaskModal":
                currentTask.description = formData.get("task-description");
                currentTask.dueDate = formData.get("task-due-date");
                currentTask.priority = formData.get("task-priority");
                currentTask.status = formData.get("task-status");
                tdController.updateTask(currentTask);
                currentTask = null;
                initialize();
                break;
            case "deleteTaskModal":
                tdController.deleteTask(currentTask);
                currentTask = null;
                initialize();
                break;
        }

    };

    const createModal = (modalId) => {

        const dialog = document.createElement("dialog");
        const diagConf = modalConfigurations.find(modal => modal.id === modalId);

        if(diagConf){

            dialog.id = diagConf.id;

            const modalHeader = document.createElement("h3");
            modalHeader.textContent = diagConf.header;

            dialog.appendChild(modalHeader);

            const form = document.createElement("form");
            form.method = "dialog";

            diagConf.fields.forEach(field => {
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

        
    };

    const setButtonTooltip = (fieldId) => {

        const btnConf = tooltipConfigurations.find(tooltip => tooltip.id === fieldId);
        const group = document.createElement("div");
        group.classList.add("tooltip");
        if(btnConf){
            const button = document.createElement(btnConf.type);
            button.classList.add(btnConf.class);

            const tooltip = document.createElement("span");
            tooltip.classList.add("tooltip-text");
            tooltip.textContent = btnConf.tooltip;

            group.appendChild(button);
            group.appendChild(tooltip);
        }

        return group;
        
    }

    const initialize = () => {

        mainContainer.innerHTML = "";
        
        setHeader();
        setSideBar();
        setContentArea();

    };

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

            const dueSoonTasks = getDueSoonTasks(user);
            const userName = document.createElement("h3");
            const userIcon = document.createElement("img");
            let news = null;
            if(dueSoonTasks.length > 0){
                news = setButtonTooltip("notification");
            }else{
                news = setButtonTooltip("no-notification");
            }
            const logOutBtn = setButtonTooltip("log-out");

            userIcon.src = userImage;
            news.classList.add("notification");
            
            userName.innerHTML = "Welcome, " + user.userName;
            userNameContainer.appendChild(userIcon);
            userNameContainer.appendChild(userName);
            
            
            logOutBtn.querySelector("button").addEventListener("click", function(e) {
                showHeaderActionModal(e);
            });
            news.querySelector("button").addEventListener("click", () => showNotificationModal(getDueSoonTasks(user)));
            headerAction.appendChild(news);
            headerAction.appendChild(logOutBtn);
            header.appendChild(userNameContainer);
            header.appendChild(headerAction);
        }else{
            const headerAction = document.createElement("div");
            const logInBtn = setButtonTooltip("log-in");
            logInBtn.querySelector("button").addEventListener("click", function(e) {
                showHeaderActionModal(e);
            });
            headerAction.appendChild(logInBtn);
            header.appendChild(headerAction);

        }
    };

    const showNotificationModal = (dueSoonTasks) => {
        console.log("notifiaction modal");
        const dialog = document.createElement("dialog");
        dialog.id = "notificationModal";
        const modalHeader = document.createElement("h3");

        const dialogButtons = document.createElement("div");
        dialogButtons.classList.add("dialog-buttons");

        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.textContent = "Got it";

        dialogButtons.appendChild(submitBtn);

        const form = document.createElement("form");
        form.method = "dialog";

        if(dueSoonTasks.length > 0){

            modalHeader.textContent = "You have notifications";

            dialog.appendChild(modalHeader);
            
            dueSoonTasks.forEach(task =>{
                const field = document.createElement("p");
                field.innerHTML = `Task <i>${task.taskName}</i> from project <i>${task.projectName}</i> is due soon`;
                form.appendChild(field);
                field.style.marginBottom = "1.5rem";
            })

        }else{
            modalHeader.textContent = "You do not have notifications";

            dialog.appendChild(modalHeader);
            
        }
        submitBtn.addEventListener("click", (event) => {
            dialog.close();
            dialog.remove();
            
        });
        form.appendChild(dialogButtons);
        dialog.appendChild(form);
        body.appendChild(dialog);
        dialog.showModal();
    }

    const getDueSoonTasks = (user) => {

        const dueSoonTasks = [];
        if(user){
            user.projects.forEach(project => {
                project.tasks.filter(task =>{
                   const taskDueDate = new Date(task.dueDate);
                   const today = new Date();
                   const timeDifference = (taskDueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
                   if (task.status !== "done" && timeDifference <= 2){

                       dueSoonTasks.push({
                           taskName: task.title,
                           projectName: project.title,
                       });
                   }
               });
           });
        }
        return dueSoonTasks;
            
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

            addProjectBtn.addEventListener("click", (event) => createModal("createPjModal"));

            projectTitleContainer.appendChild(pjImg);
            projectTitleContainer.appendChild(projectTitle);
            sideBar.appendChild(addProjectBtn);
            sideBar.appendChild(projectTitleContainer);
            sideBar.appendChild(pjList);
        }
        mainContainer.appendChild(sideBar);

    };

    const setContentArea = () => {

        const contentArea = document.createElement("div");
        contentArea.innerHTML = "";

        if(currentProject){
            const projectContainer = document.createElement("div");
            const projectInfoContainer = document.createElement("div");
            const projectActionContainer = document.createElement("div");
            const projectTitle = document.createElement("h2");
            const projectDescription = document.createElement("p");
            const editProjectBtn = setButtonTooltip("project-edit");
            const deleteProjectBtn = setButtonTooltip("project-delete");

            
            projectActionContainer.appendChild(editProjectBtn);
            projectActionContainer.appendChild(deleteProjectBtn);

            projectContainer.classList.add("project-info");
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

            editProjectBtn.querySelector("button").addEventListener("click", (event) => {
                createModal("editPjModal");
                const modal = document.getElementById("editPjModal");
                modal.querySelector("h3").textContent = currentProject.title;
                document.getElementById("project-description").value = currentProject.description;
            });

            deleteProjectBtn.querySelector("button").addEventListener("click", (event) => {
                createModal("deletePjModal");
            });
            
        }

        contentArea.classList.add("content-area");
        mainContainer.appendChild(contentArea);

        if(currentProject){
            currentProject.tasks.map((task) => setTaskLocation(task));

        }
    };

    const setTasks = () => {

        const taskBoard = document.createElement("div")

        const todoTasks = document.createElement("div");
        const inProgressTasks = document.createElement("div");
        const doneTasks = document.createElement("div")

        todoTasks.classList.add("column");
        inProgressTasks.classList.add("column");
        doneTasks.classList.add("column");

        const todoTitle = document.createElement("h2");
        const inProgressTitle = document.createElement("h2");
        const doneTitle = document.createElement("h2");

        todoTitle.textContent = "To Do";
        inProgressTitle.textContent = "In Progress";
        doneTitle.textContent = "Done";

        todoTasks.appendChild(todoTitle);
        inProgressTasks.appendChild(inProgressTitle);
        doneTasks.appendChild(doneTitle);

        todoTasks.id = "to-do";
        inProgressTasks.id = "in-progress";
        doneTasks.id = "done";

        todoTasks.dataset.status = "to-do";
        inProgressTasks.dataset.status = "in-progress";
        doneTasks.dataset.status = "done";

        const taskContainer = document.createElement("div");

        const titleContainer = document.createElement("div");
        const taskTitle = document.createElement("h2");
        const taskCreateBtn = setButtonTooltip("task-create");

        taskContainer.classList.add("task-container");
        titleContainer.classList.add("title");
        taskCreateBtn.classList.add("create");


        titleContainer.appendChild(taskTitle);
        titleContainer.appendChild(taskCreateBtn);

        todoTasks.addEventListener("dragover", handleDragOver);
        todoTasks.addEventListener("dragleave", handleDragLeave);
        todoTasks.addEventListener("drop", handleDrop);

        inProgressTasks.addEventListener("dragover", handleDragOver);
        inProgressTasks.addEventListener("dragleave", handleDragLeave);
        inProgressTasks.addEventListener("drop", handleDrop);

        doneTasks.addEventListener("dragover", handleDragOver);
        doneTasks.addEventListener("dragleave", handleDragLeave);
        doneTasks.addEventListener("drop", handleDrop);


        taskTitle.innerHTML = "Tasks";
        taskCreateBtn.querySelector("button").addEventListener("click", (event) => createModal("createTaskModal"));

        taskContainer.appendChild(titleContainer);
        taskContainer.appendChild(todoTasks);
        taskContainer.appendChild(inProgressTasks);
        taskContainer.appendChild(doneTasks);

        return taskContainer;

    };

    const showHeaderActionModal = (e) => {

        const modalOption = e.target.parentElement.querySelector(".tooltip-text").innerHTML;

        if (modalOption === "Log In"){

            createModal("logInModal");
            document.querySelector("#user-name").value = "guest User";

        }else if (modalOption === "Log Out"){

            createModal("logOutModal");
        }
    };

    const setTaskLocation = (task) => {
        
        const taskStatus = task.status;

        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.draggable = true;
        taskDiv.dataset.id = task.title;

        const taskTitle = document.createElement("h3");
        taskTitle.textContent = task.title;

        const taskDescription = document.createElement("p");
        taskDescription.textContent = task.description;

        const taskPriority = document.createElement("div");
        taskPriority.classList.add("priority");
        taskPriority.classList.add("tooltip");

        const priorityImg = document.createElement("img");

        const tooltipPriotity = document.createElement("span");
        tooltipPriotity.classList.add("tooltip-text");

        if (task.priority === "1"){
            priorityImg.src = highImg;
            tooltipPriotity.textContent = "High"
        }else if(task.priority === "2"){
            priorityImg.src = mediumImg;
            tooltipPriotity.textContent = "Medium";
        }else{
            priorityImg.src = lowImg;
            tooltipPriotity.textContent = "Low";
        }

        taskPriority.appendChild(priorityImg);
        taskPriority.appendChild(tooltipPriotity);

        const trafficLight = document.createElement("div");
        trafficLight.classList.add("traffic-light");
        trafficLight.classList.add("tooltip");

        const color = document.createElement("div");
        const tooltipDueDate = document.createElement("span");
        tooltipDueDate.classList.add("tooltip-text");

        
        validateDueDate(color,task);

        tooltipDueDate.textContent = task.dueDate;

        trafficLight.appendChild(color);
        trafficLight.appendChild(tooltipDueDate);


        const taskAction = document.createElement("div");
        taskAction.classList.add("task-action");

        const editBtn = setButtonTooltip("task-edit");
        editBtn.querySelector("button").addEventListener("click", (event) => {
            const taskId = event.target.parentElement.parentElement.parentElement.dataset.id;
            currentTask = tdController.selectTask(taskId).currentTask;
            createModal("ediTaskModal");
            const modal = document.getElementById("ediTaskModal");
            modal.querySelector("h3").textContent = currentTask.title;
            document.getElementById("task-description").value = currentTask.description;
            document.getElementById("task-due-date").value = currentTask.dueDate;
            document.getElementById("task-priority").value = currentTask.priority;
            document.getElementById("task-status").value = currentTask.status;
        });

        const deleteBtn = setButtonTooltip("task-delete");
        deleteBtn.querySelector("button").addEventListener("click", () => createModal("deleteTaskModal"));

        taskAction.appendChild(editBtn);
        taskAction.appendChild(deleteBtn);

        taskDiv.appendChild(taskTitle);
        taskDiv.appendChild(taskDescription);
        taskDiv.appendChild(taskPriority);
        taskDiv.appendChild(trafficLight);
        taskDiv.appendChild(taskAction);

        document.getElementById(task.status.replace(" ", "-")).appendChild(taskDiv);

        taskDiv.addEventListener("dragstart", handleDragStart);
        taskDiv.addEventListener("dragend", handleDragEnd);


    };

    const validateDueDate = (color, task) => {

        const taskDueDate = new Date(task.dueDate);
        const today = new Date();
        const timeDifference = (taskDueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
        if (task.status !== "done"){
            if(timeDifference <= 2){
                color.className = "red";
            }else if (timeDifference > 2 && timeDifference <=  5){
                color.className = "yellow";
            }else{
                color.className = "green";
            }
        }else {
            color.className = "done";
        }
    };

    const handleDragStart = (event) => {
        currentTask = tdController.selectTask(event.target.querySelector("h3").textContent).currentTask;
        event.target.classList.add("dragging");
        event.dataTransfer.setData("text/plain", event.target.dataset.id);
    };

    const handleDragEnd = (event) => {
        event.target.classList.remove("dragging");
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.currentTarget.classList.add("drag-over");
    };

    const handleDragLeave = (event) => {
        event.currentTarget.classList.remove("drag-over");
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove("drag-over");

        const taskId = event.dataTransfer.getData("text/plain");
        const taskElement = document.querySelector(`[data-id='${taskId}']`);
        const newStatus = event.currentTarget.dataset.status;

        currentTask.status = newStatus.replace("-", " ");
        user = tdController.updateTask(currentTask);

        event.currentTarget.appendChild(taskElement);
        const color = taskElement.querySelector(".traffic-light").querySelector("div");
        validateDueDate(color, currentTask);

    };

    const setCurrentProject = (event) => {
        currentProject = tdController.selectProject(event.target.id).currentProject;
        mainContainer.innerHTML = "";
        setSideBar();
        setContentArea();
    };

    return {
        initialize,
    }
    
}