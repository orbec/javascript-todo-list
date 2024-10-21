import { Status } from "../util/Constants";
export default class Task {
  #title;
  #description;
  #dueDate;
  #priority;
  #status;

  constructor(title, description, dueDate, priority) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#status = Status.TODO;
  }

  get title() {
    return this.#title;
  }

  set title(title) {
    this.#title = title;
  }

  get description() {
    return this.#description;
  }

  set description(description) {
    this.#description = description;
  }

  get dueDate() {
    return this.#dueDate;
  }

  set dueDate(dueDate) {
    this.#dueDate = dueDate;
  }

  get priority() {
    return this.#priority;
  }

  set priority(priority) {
    this.#priority = priority;
  }

  set status(status) {
    this.#status = status;
  }

  get status() {
    return this.#status;
  }

  toJSON() {
    return {
      title: this.#title,
      description: this.#description,
      dueDate: this.#dueDate,
      priority: this.#priority,
      status: this.#status,
    };
  }

  static fromJSON(data) {
    return Object.assign(new Task(), data);
  }
}
