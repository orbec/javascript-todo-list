import "../style.css";
import todoListController from "./TodoListController";
import userImage from "../assets/images/avatar-svgrepo-com.svg";
import projectImg from "../assets/images/folder-share-svgrepo-com.svg";
import addProjectImg from "../assets/images/add-folder-svgrepo-com.svg";

export default function screenController(){


    let tdController;

    let user;
    let currentProject;

    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const mainContainer = document.querySelector(".main-container");

    const showModalCreateUser = () => {

    }

    const initialize = () => {

        
        const contentArea = document.createElement("div");

        
        mainContainer.innerHTML = ""
        
        setHeader();
        setSideBar();

        
        contentArea.classList.add("content-area");
        
        
        contentArea.innerHTML = "content-area";

        mainContainer.appendChild(contentArea);

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

    function logOut(){
        user = tdController.closeUser();
        initialize();
    }

    function showHeaderActionModal(e){
        const modalOption = e.target.querySelector(".tooltip-text").innerHTML;
        const modal = document.createElement("dialog");
        const cancelBtn = document.createElement("button");
        const confirmBtn = document.createElement("button");
        const actionContainer = document.createElement("div");
        actionContainer.appendChild(cancelBtn);
        actionContainer.appendChild(confirmBtn);
        const confirmLabel = document.createElement("h3");
        cancelBtn.innerHTML = "Cancel";
        confirmBtn.innerHTML = "Confirm";
        cancelBtn.addEventListener("click", () => {
            modal.close();
            modal.remove();
        });
        confirmBtn.setAttribute("type", "submit");
        if (modalOption === "Log In"){

            const form = document.createElement("form");

            const userNameContainer = document.createElement("div");
            const userNameLabel = document.createElement("label");
            const userNameInput = document.createElement("input");

            const defaultProjectContainer = document.createElement("div");
            const defaultProjectLabel = document.createElement("label");
            const defaultProjectInput = document.createElement("input");

            userNameLabel.setAttribute("for", "user-name");
            userNameLabel.innerHTML = "User Name";

            userNameInput.setAttribute("type", "input");
            userNameInput.setAttribute("id", "user-name");
            userNameInput.setAttribute("name", "user-name");
            userNameInput.value = "guest User";

            userNameContainer.appendChild(userNameLabel);
            userNameContainer.appendChild(userNameInput);

            defaultProjectLabel.setAttribute("for", "default-project");
            defaultProjectLabel.innerHTML = "Do you want to include a default project? This only works if you are a new user";

            defaultProjectInput.setAttribute("type", "checkbox");
            defaultProjectInput.setAttribute("id", "default-project");
            defaultProjectInput.setAttribute("name", "default-project");

            defaultProjectContainer.appendChild(defaultProjectInput);
            defaultProjectContainer.appendChild(defaultProjectLabel);

            confirmLabel.innerHTML = "Provide a user name, default 'guest User'";

            confirmBtn.addEventListener("click", () => {
                todoListController(userNameInput.value).then((data) => {
                    tdController = data;
                    if(defaultProjectInput.checked){
                        tdController.createProject("default", `Default project for user ${userNameInput.value}`);
                    }
                    setTimeout(() => {
                        user = tdController.getCurrentUser();
                        initialize();
                    }, 100);
                    
                });
                
                modal.close();
                modal.remove();
            });

            modal.appendChild(confirmLabel);
            modal.appendChild(userNameContainer);
            modal.appendChild(defaultProjectContainer);
            modal.appendChild(actionContainer);
            


        }else if (modalOption === "Log Out"){
            
            const clearData = document.createElement("input");
            const clearDataContainer = document.createElement("div");
            const clearDataLabel = document.createElement("label");

            clearData.setAttribute("type", "checkbox");
            clearData.setAttribute("id", "clear-data");
            clearData.setAttribute("name", "clear-data");
            clearData.setAttribute("value", "1");

            clearDataLabel.setAttribute("for", "clear-data");
            clearDataLabel.innerHTML = "Do you want to clear your personal data?";
            actionContainer.classList.add("action-container");
            confirmLabel.innerHTML = "Are you sure you want to Quit?"
            
            
            confirmBtn.addEventListener("click", () => {
                console.log(clearData.checked);
                if(clearData.checked){
                    tdController.clearUser();
                }
                logOut();
                modal.close();
                initialize();
                modal.remove();
            });
            clearDataContainer.appendChild(clearData);
            clearDataContainer.appendChild(clearDataLabel);

            actionContainer.appendChild(cancelBtn);
            actionContainer.appendChild(confirmBtn);
            modal.appendChild(confirmLabel);
            modal.appendChild(clearDataContainer);
            modal.appendChild(actionContainer);
        }
        body.appendChild(modal);
        modal.showModal();
    }

    function showAddprojectModal(e){
        const modal = document.createElement("dialog");
        const cancelBtn = document.createElement("button");
        const confirmBtn = document.createElement("button");
        const actionContainer = document.createElement("div");
        actionContainer.appendChild(cancelBtn);
        actionContainer.appendChild(confirmBtn);
        const confirmLabel = document.createElement("h3");
        cancelBtn.innerHTML = "Cancel";
        confirmBtn.innerHTML = "Confirm";
        cancelBtn.addEventListener("click", () => {
            modal.close();
            modal.remove();
        });
        confirmBtn.setAttribute("type", "submit");

        const titleContainer = document.createElement("div");
        const titleLabel = document.createElement("label");
        const titleInput = document.createElement("input");

        const descriptionContainer = document.createElement("div");
        const descriptionLabel = document.createElement("label");
        const descriptionInput = document.createElement("input");

        titleLabel.setAttribute("for", "project-title");
        titleLabel.innerHTML = "Project Title";

        titleInput.setAttribute("type", "input");
        titleInput.setAttribute("id", "project-title");
        titleInput.setAttribute("name", "project-title");

        titleContainer.appendChild(titleLabel);
        titleContainer.appendChild(titleInput);

        descriptionLabel.setAttribute("for", "project-description");
        descriptionLabel.innerHTML = "Project Description";

        descriptionInput.setAttribute("type", "inpput");
        descriptionInput.setAttribute("id", "project-description");
        descriptionInput.setAttribute("name", "project-description");

        descriptionContainer.appendChild(descriptionLabel);
        descriptionContainer.appendChild(descriptionInput);

        confirmLabel.innerHTML = "Provide a Project's name and Description";

        confirmBtn.addEventListener("click", (event) => {

            const projectTitle = document.querySelector("#project-title");
            const projectDescription = document.querySelector("#project-description");
            console.log(projectTitle.value + ", " + projectDescription.value);

            currentProject = tdController.createProject(projectTitle.value, projectDescription.value).currentProject;

            setSideBar();
            modal.close();
            modal.remove();
        });

        modal.appendChild(confirmLabel);
        modal.appendChild(titleContainer);
        modal.appendChild(descriptionContainer);
        modal.appendChild(actionContainer);
            
        
        body.appendChild(modal);
        modal.showModal();
    }

    function getCurrentUser(){
        return user;
    }

    function getUser(userName){
        tdController.getUser(userName);
    }

    return {
        initialize,
        getCurrentUser,
        getUser,
    }

    

    
}