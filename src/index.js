import "./style.css";
import todoListController from "./controllers/TodoListController";
import { Status, Priority } from "./util/Constants";

const nombreUsuario = prompt("Please provide your userName", "guest User");

window.b = Status;
window.c = Priority;
window.a =  await todoListController(nombreUsuario);






