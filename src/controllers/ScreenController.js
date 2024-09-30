import "../style.css";
import todoListController from "./TodoListController";

export default function screenController(){


    let tdController;

    let user;

    const body = document.querySelector("body");

    const showModalCreateUser = () => {

    }

    const initialize = () => {

        body.innerHTML = "";
    
        const container = document.createElement("div");
        const header = setHeader(user);
        const sideBar = document.createElement("div");
        const contentArea = document.createElement("div");
        const footer = document.createElement("div")

        container.classList.add("main-container");
        header.classList.add("header");
        sideBar.classList.add("side-bar");
        contentArea.classList.add("content-area");
        footer.classList.add("footer");

        

        
        sideBar.innerHTML = "sidebar";
        contentArea.innerHTML = "content";
        footer.innerHTML = "footer";

        container.appendChild(header);
        container.appendChild(sideBar);
        container.appendChild(contentArea);
        container.appendChild(footer)

        body.appendChild(container);
    }

    const setHeader = (user)  => {

        const header = document.createElement("div");
        const userNameContainer = document.createElement("div");
        const headerAction = document.createElement("div");
        
        if (user){
            
            userNameContainer.innerHTML = user.userName;
            const logOutBtn = document.createElement("button");
            const tooltipText = document.createElement("span");
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
            header.appendChild(userNameContainer);
            header.appendChild(headerAction);

        }
        return header;
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
        const confirmLabel = document.createElement("h1");
        cancelBtn.innerHTML = "Cancel";
        confirmBtn.innerHTML = "Confirm";
        cancelBtn.addEventListener("click", () => modal.close());
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
                    user = tdController.getCurrentUser();
                    initialize();
                    if(defaultProjectInput.checked && user.projects.length === 0){
                        tdController.createProject("default", `Defaul project for user ${userNameInput.value}`);
                    }
                });
                
                modal.close();
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
                if(clearData.checked){
                    tdController.clearUser();
                }
                logOut();
                modal.close();
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

    function getCurrentUser(){
        return user;
    }

    return {
        initialize,
        getCurrentUser,
    }

    

    
}