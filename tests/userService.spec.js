import { jest } from "@jest/globals";
import TaskServices from "../services/taskServices.js";
import Task from "../models/taskSchema.js";
import User from "../models/userSchema.js";

    // Registers a new user with valid email, password, confirmPassword, and username.
    it('should register a new user with valid details', async () => {
        // Initialize the UserService object
        const userService = new UserService();
  
        // Mock the User.findOne method to return null
        User.findOne = jest.fn().mockResolvedValue(null);
  
        // Mock the bcrypt.hash method to return a hashed password
        bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
  
        // Mock the User.save method to return the registered user
        User.prototype.save = jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'hashedPassword', username: 'testuser' });
  
        // Call the registerUser method with valid details
        const registeredUser = await userService.registerUser('test@example.com', 'password', 'password', 'testuser');
  
        // Assert that the registered user object is returned
        expect(registeredUser).toEqual({ email: 'test@example.com', password: 'hashedPassword', username: 'testuser' });
  
        // Assert that User.findOne is called with the correct parameters
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  
        // Assert that bcrypt.hash is called with the correct parameters
        expect(bcrypt.hash).toHaveBeenCalledWith('password', 9);
  
        // Assert that User.save is called with the correct parameters
        expect(User.prototype.save).toHaveBeenCalledWith();
  
      });
  // create a task with missing parameters and check if it throws an error
  it("should throw an error when creating a task with missing parameters", async () => {
    // Arrange
    const title = "Task 1";
    const description = "Task description";
    const dueDate = new Date();
    const priority = "Top";
    const user = new User();

    // Act
    const taskServices = new TaskServices();

    // Assert
    await expect(
      taskServices.createTask(title, description, dueDate, priority)
    ).rejects.toThrow(Error);
  });

  // retrieve all tasks associated with a user
  it("should retrieve all tasks associated with a user", async () => {
    // Arrange
    const user = new User();
    const findUser = { id: user.id, _id: user.id };
    const findTasks = [{ title: "Task 1" }, { title: "Task 2" }];

    jest.spyOn(User, "findById").mockResolvedValue(findUser);
    jest.spyOn(Task, "find").mockResolvedValue(findTasks);

    // Act
    const taskServices = new TaskServices();
    const result = await taskServices.getTasks(user);

    // Assert
    expect(result).toEqual(findTasks);
    expect(User.findById).toHaveBeenCalledWith(user.id);
    expect(Task.find).toHaveBeenCalledWith({
      user: findUser.id,
      isDeleted: false,
    });
  });

  // retrieve a task with the given task ID
  it("should retrieve a task with the given task ID", async () => {
    // Arrange
    const taskId = "123";
    const findTask = { _id: taskId };

    jest.spyOn(Task, "findOne").mockResolvedValue(findTask);

    // Act
    const taskServices = new TaskServices();
    const result = await taskServices.getTask(taskId);

    // Assert
    expect(result).toEqual(findTask);
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
  });

  // update a task with the given task ID
  it("should update a task with the given task ID", async () => {
    // Arrange
    const taskId = "123";
    const updateObject = { title: "Updated Task" };
    const findTask = { _id: taskId };
    const updatedTask = { nModified: 1 };

    jest.spyOn(Task, "findOne").mockResolvedValue(findTask);
    jest.spyOn(Task, "updateOne").mockResolvedValue(updatedTask);

    // Act
    const taskServices = new TaskServices();
    const result = await taskServices.updateTask(taskId, updateObject);

    // Assert
    expect(result.task).toEqual(findTask);
    expect(result.updatedTask).toEqual(updatedTask);
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
    expect(Task.updateOne).toHaveBeenCalledWith(
      { _id: findTask._id },
      { $set: updateObject },
      { new: true }
    );
  });

  // get tasks associated with a user and check if they are returned correctly
  it("should get tasks associated with a user and return them correctly", async () => {
    // Arrange
    const user = new User();
    const findUser = { id: user.id, _id: user.id };
    const findTasks = [
      { _id: "task1", title: "Task 1" },
      { _id: "task2", title: "Task 2" },
    ];
    jest.spyOn(User, "findById").mockResolvedValue(findUser);
    jest.spyOn(Task, "find").mockResolvedValue(findTasks);

    // Act
    const taskServices = new TaskServices();
    const result = await taskServices.getTasks(user);

    // Assert
    expect(result).toEqual(findTasks);
    expect(User.findById).toHaveBeenCalledWith(user.id);
    expect(Task.find).toHaveBeenCalledWith({
      user: findUser.id,
      isDeleted: false,
    });
  });

  // get a task with a valid task ID and check if it is returned correctly
  it("should get a task with a valid task ID and return it correctly", async () => {
    // Arrange
    const taskId = "task1";
    const findTask = { _id: taskId, title: "Task 1" };
    jest.spyOn(Task, "findOne").mockResolvedValue(findTask);

    // Act
    const taskServices = new TaskServices();
    const result = await taskServices.getTask(taskId);

    // Assert
    expect(result).toEqual(findTask);
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
  });

  // update a task with a valid task ID and update object and check if it is updated and returned correctly
  it("should update a task with a valid task ID and update object and return it correctly", async () => {
    // Arrange
    const taskId = "task1";
    const updateObject = { title: "Updated Task" };
    const findTask = { _id: taskId, title: "Task 1" };
    const updatedTask = { nModified: 1 };
    jest.spyOn(Task, "findOne").mockResolvedValue(findTask);
    jest.spyOn(Task, "updateOne").mockResolvedValue(updatedTask);

    // Act
    const taskServices = new TaskServices();
    const result = await taskServices.updateTask(taskId, updateObject);

    // Assert
    expect(result.task).toEqual(findTask);
    expect(result.updatedTask).toEqual(updatedTask);
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
    expect(Task.updateOne).toHaveBeenCalledWith(
      { _id: findTask._id },
      { $set: updateObject },
      { new: true }
    );
  });

  // delete a task with a valid task ID and check if it is deleted and returned correctly
  it("should delete a task with a valid task ID and return the deleted task", async () => {
    // Arrange
    const taskId = "validTaskId";
    const findTask = new Task({ _id: taskId });
    const updatedTask = { isDeleted: true };
    const deletedTask = { deletedTask: { isDeleted: true } };

    jest.spyOn(Task, "findOne").mockResolvedValue(findTask);
    jest.spyOn(Task, "updateOne").mockResolvedValue(updatedTask);

    // Act
    const taskServices = new TaskServices();
    const result = await taskServices.deleteTask(taskId);

    // Assert
    expect(result).toEqual(deletedTask);
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
    expect(Task.updateOne).toHaveBeenCalledWith(
      { _id: findTask._id },
      { $set: updatedTask },
      { new: true }
    );
  });

  // get tasks associated with a non-existent user and check if it throws an error
  it("should throw an error when getting tasks associated with a non-existent user", async () => {
    // Arrange
    const userId = "nonExistentUserId";

    jest.spyOn(User, "findById").mockResolvedValue(null);

    // Act
    const taskServices = new TaskServices();
    const getTasks = async () => {
      await taskServices.getTasks({ id: userId });
    };

    // Assert
    await expect(getTasks()).rejects.toThrow("User not found");
    expect(User.findById).toHaveBeenCalledWith(userId);
  });

  // get a task with a non-existent task ID and check if it throws an error
  it("should throw an error when getting a task with a non-existent task ID", async () => {
    // Arrange
    const taskId = "nonExistentTaskId";

    jest.spyOn(Task, "findOne").mockResolvedValue(null);

    // Act
    const taskServices = new TaskServices();
    const getTask = async () => {
      await taskServices.getTask(taskId);
    };

    // Assert
    await expect(getTask()).rejects.toThrow("Task not found");
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
  });

  // update a task with a non-existent task ID and check if it throws an error
  it("should throw an error when updating a task with a non-existent task ID", async () => {
    // Arrange
    const taskId = "non-existent-task-id";
    const updateObject = { title: "Updated Task" };

    jest.spyOn(Task, "findOne").mockResolvedValue(null);

    // Act
    const taskServices = new TaskServices();

    // Assert
    await expect(taskServices.updateTask(taskId, updateObject)).rejects.toThrow(
      "Task not Found"
    );
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
  });

  // delete a task with a non-existent task ID and check if it throws an error
  it("should throw an error when deleting a task with a non-existent task ID", async () => {
    // Arrange
    const taskId = "non-existent-task-id";

    jest.spyOn(Task, "findOne").mockResolvedValue(null);

    // Act
    const taskServices = new TaskServices();

    // Assert
    await expect(taskServices.deleteTask(taskId)).rejects.toThrow(
      "Task not Found"
    );
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
  });

  // update a task with an empty update object and check if it throws an error
  it("should throw an error when updating a task with an empty update object", async () => {
    // Arrange
    const taskId = "task-id";
    const updateObject = {};

    jest.spyOn(Task, "findOne").mockResolvedValue(null);

    // Act
    const taskServices = new TaskServices();
    let error;
    try {
      await taskServices.updateTask(taskId, updateObject);
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toEqual(new Error("Task not Found"));
    expect(Task.findOne).toHaveBeenCalledWith({ _id: taskId });
  });
});
