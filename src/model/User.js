import Project from "./Project";
export default class User {
  #userName;
  #projects;

  constructor(userName) {
    this.#userName = userName;
    this.#projects = [];
  }

  get userName() {
    return this.#userName;
  }

  get projects() {
    return this.#projects;
  }

  addProject(project) {
    this.#projects.push(project);
  }

  set projects(projects) {
    this.#projects = projects;
  }

  deleteProject(projectName) {
    this.#projects = this.#projects.filter(
      (element) => element.title !== projectName,
    );
  }

  toJSON() {
    return {
      userName: this.#userName,
      projects: this.#projects.map((project) => project.toJSON()),
    };
  }

  static fromJSON(data) {
    const user = new User(data.userName);
    user.#projects = data.projects.map((project) => Project.fromJSON(project));
    return user;
  }
}
