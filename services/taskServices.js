import { Task } from "../models/taskSchema.js";
import { User } from "../models/userSchema.js";
export default class TaskServices {
  /**
   * Creates a new task with the given parameters.
   *
   * @param {string} title - The title of the task.
   * @param {string} description - The description of the task.
   * @param {Date} dueDate - The due date of the task.
   * @param {string} priority - The priority of the task.
   * @param {User} user - The user associated with the task.
   * @returns {Task} The newly created task.
   * @throws {Error} If the task is not created.
   */
  async createTask(title, description, dueDate, priority, user) {
    const newTask = await new Task({
      title: title,
      description: description,
      creationDate: Date.now(),
      dueDate,
      priority,
      user: user.id,
    });
    if (!newTask) throw new Error("Task not created");
    await newTask.save();
    return newTask;
  }

  /**
   * Retrieves all tasks associated with a user.
   *
   * @param {User} user - The user object.
   * @returns {Array<Task>} An array of tasks associated with the user.
   * @throws {Error} If the user is not found or if no tasks are found.
   */
  async getTasks(user) {
    const findUser = await User.findById(user.id);
    if (!findUser) throw new Error("User not found");
    const findTasks = await Task.find({ user: findUser._id, isDeleted: false });
    if (!findTasks) throw new Error("tasks not found");
    return findTasks;
  }

  /**
   * Retrieves a task with the given task ID.
   *
   * @param {string} taskId - The ID of the task.
   * @returns {Task} The task with the given ID.
   * @throws {Error} If the task is not found.
   */
  async getTask(taskId) {
    const findTask = await Task.findOne({ _id: taskId });
    if (!findTask) throw new Error("Task not found");
    return findTask;
  }

  /**
   * Updates a task with the given task ID.
   *
   * @param {string} taskId - The ID of the task to be updated.
   * @param {object} updateObject - The object containing the fields to be updated.
   * @returns {object} An object containing the updated task and the result of the update operation.
   * @throws {Error} If the task is not found or if the update operation fails.
   */
  async updateTask(taskId, updateObject) {
    const findTask = await Task.findOne({ _id: taskId });
    if (!findTask) {
      throw new Error("Task not Found");
    }
    const updatedTask = await Task.updateOne(
      { _id: findTask._id },
      { $set: updateObject },
      { new: true }
    );
    if (!updatedTask) throw new Error("Couldn't update the task");
    const task = await Task.findOne({ _id: taskId });
    return { task, updatedTask };
  }

  /**
   * This code snippet represents a method for deleting a task.
   * It throws an error if the task is not found.
   * It updates the task's 'isDeleted' property to true.
   * It returns the deleted task.
   * @throws {Error} If the task is not found or couldn't be updated
   * @returns {Object} The deleted task
   */
  async deleteTask(taskId) {
    const findTask = await Task.findOne({ _id: taskId });
    if (!findTask) {
      throw new Error("Task not Found");
    }
    let updatedTask = { isDeleted: true };
    const deletedTask = await Task.updateOne(
      { _id: findTask._id },
      { $set: updatedTask },
      { new: true }
    );
    if (!updatedTask) throw new Error("Couldn't update the task");
    return { deletedTask };
  }
}
