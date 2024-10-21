import Task from "./Task";

export default class Project {
  #title;
  #description;
  #tasks;

  constructor(title, description) {
    this.#title = title;
    this.#description = description;
    this.#tasks = [];
  }

  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  set description(description) {
    this.#description = description;
  }

  get tasks() {
    return this.#tasks;
  }

  addTask(task) {
    this.#tasks.push(task);
  }

  set tasks(taskList) {
    this.#tasks = taskList;
  }

  deleteTask(taskName) {
    this.#tasks = this.#tasks.filter((element) => element.title !== taskName);
  }

  toJSON() {
    return {
      title: this.#title,
      description: this.#description,
      tasks: this.#tasks.map((task) => task.toJSON()),
    };
  }

  static fromJSON(data) {
    const project = new Project(data.title, data.description);
    project.#tasks = data.tasks.map((task) => Task.fromJSON(task));
    return project;
  }
}
