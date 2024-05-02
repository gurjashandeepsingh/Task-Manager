import Task from "../models/taskSchema.js";
import User from "../models/userSchema.js";
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
    const newTask = {
      title: title,
      description: description,
      creationDate: Date.now(),
      dueDate,
      priority,
      user: user.id,
    };
    if (!newTask) throw new Error("Task not created");
    await Task.create(newTask);
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
   * Marks a task as completed.
   *
   * @param {string} taskId - The ID of the task to mark as completed.
   * @returns {Promise<object>} The updated task object with the status set to "completed".
   * @throws {Error} If the task with the specified ID is not found or if the task update fails.
   */
  async doneTask(taskId) {
    const findTask = await Task.findById(taskId);
    if (!findTask) throw new Error("Could not find Task");
    const updatedTask = await Task.updateOne(
      { _id: findTask._id },
      { status: "completed" },
      { new: true }
    );
    if (!updatedTask) throw new Error("Could not update task");
    return updatedTask;
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

  async searchString(searchString, user) {
    const regexExpression = new RegExp(`.*(${searchString}).*`, "i");
    const findTask = await Task.find({
      user: user.id,
      $or: [
        { title: { $regex: regexExpression } },
        { description: { $regex: regexExpression } },
        { status: { $regex: regexExpression } },
        { priority: { $regex: regexExpression } },
      ],
    });
    if (!findTask) throw new Error("Can't find Anything :(");
    return findTask;
  }

  async pagination(pageNumber) {
    const numberOfDocs = 10;
    const skipDocs = (pageNumber - 1) * numberOfDocs;
    const findDocs = await Task.find().skip(skipDocs).limit(numberOfDocs);
    if (!findDocs) throw new Error(`No tasks found for page: ${pageNumber}`);
    return findDocs;
  }

  /**
   * Calculates the percentage of tasks in different statuses for a given user.
   *
   * @param {User} user - The user object.
   * @returns {Object} An object containing the percentage of tasks in different statuses.
   * @throws {Error} If the user is not found or if there are no tasks associated with the user.
   */
  async percentageAllTime(user) {
    const allTasks = await Task.find({ user: user.id });
    const totalTasks = allTasks.length;
    const pendingTasks = allTasks.filter((task) => task.status === "pending");
    const inProgressTasks = allTasks.filter(
      (task) => task.status === "in progress"
    );
    const completedTasks = allTasks.filter(
      (task) => task.status === "completed"
    );
    const pendingPercentage = (pendingTasks.length / totalTasks) * 100;
    const inProgressPercentage = (inProgressTasks.length / totalTasks) * 100;
    const completedProgress = (completedTasks.length / totalTasks) * 100;
    return {
      Pending: pendingPercentage,
      Progress: inProgressPercentage,
      Completed: completedProgress,
    };
  }

  /**
   * Calculates the percentage of tasks in different statuses for a given user within a custom time period.
   *
   * @param {User} user - The user object.
   * @param {number} days - The number of days to consider in the time period.
   * @returns {Object} An object containing the percentage of tasks in different statuses.
   * @throws {Error} If the user is not found or if there are no tasks associated with the user.
   */
  async percentageCustomTime(user, days) {
    const DaysAgo = new Date();
    DaysAgo.setDate(DaysAgo.getDate() - days);
    const allTasks = await Task.find({
      user: user.id,
      createdAt: { $gte: DaysAgo },
    });
    const totalTasks = allTasks.length;
    const pendingTasks = allTasks.filter((task) => task.status === "pending");
    const inProgressTasks = allTasks.filter(
      (task) => task.status === "in progress"
    );
    const completedTasks = allTasks.filter(
      (task) => task.status === "completed"
    );
    const pendingPercentage = (pendingTasks.length / totalTasks) * 100;
    const inProgressPercentage = (inProgressTasks.length / totalTasks) * 100;
    const completedProgress = (completedTasks.length / totalTasks) * 100;
    return {
      Pending: pendingPercentage,
      Progress: inProgressPercentage,
      Completed: completedProgress,
    };
  }
}
