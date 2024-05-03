import { body, query, validationResult } from "express-validator";
import TaskServices from "../services/taskServices.js";
import AuthenticationMiddleware from "../middleware/middleware.js";
import { logger } from "../winstonLogger.js";
import express, { request } from "express";
const router = express.Router();

const addTaskValidation = [
  body("title").notEmpty().withMessage("Provide all parameters"),
  body("description").notEmpty().withMessage("Provide all parameters"),
  body("priority").notEmpty().withMessage("Please select priority"),
  body("dueDate").notEmpty().withMessage("Please provide due date"),
];
router.post(
  "/create",
  addTaskValidation,
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { title, description, dueDate, priority } = request.body;
      const user = request.user;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.createTask(
        title,
        description,
        dueDate,
        priority,
        user
      );
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

router.get(
  "/alltasks",
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    try {
      const user = request.user;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.getTasks(user);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

const getTaskValidation = [
  query("taskId").notEmpty().withMessage("Provide all parameters"),
];
router.get(
  "/gettask",
  getTaskValidation,
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { taskId } = request.query;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.getTask(taskId);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

const updateTaskValidation = [
  query("taskId").notEmpty().withMessage("Provide all parameters"),
];
router.put(
  "/update",
  updateTaskValidation,
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { taskId } = request.query;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.updateTask(taskId, request.body);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

const doneTaskValidation = [
  body("taskId").notEmpty().withMessage("Provide taskId"),
];
router.post(
  "/done",
  new AuthenticationMiddleware().isAuthenticate,
  doneTaskValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { taskId } = request.body;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.doneTask(taskId);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

router.post(
  "/delete/:taskId",
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { taskId } = request.params;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.deleteTask(taskId);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

const searchValidation = [
  query("searchString").notEmpty().withMessage("Provide Search String"),
];
router.get(
  "/search",
  new AuthenticationMiddleware().isAuthenticate,
  searchValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { searchString } = request.query;
      const user = request.user;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.searchString(searchString, user);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

router.get(
  "/page",
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    try {
      const { pageNumber } = parseInt(request.query);
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance().pagination(pageNumber);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

router.post(
  "/progress-all",
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    try {
      const user = request.user;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.percentageAllTime(user);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

router.post(
  "/priority-percentage",
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    try {
      const user = request.user;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.priorityPercentage(user);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

const customPercentageValidation = [
  query("days").notEmpty().withMessage("Provide days"),
];
router.post(
  "/progress-custom",
  new AuthenticationMiddleware().isAuthenticate,
  customPercentageValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const user = request.user;
      const { days } = request.query;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.percentageAllTime(user, days);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

const timeStartValidation = [
  body("taskId").notEmpty().withMessage("Provide TaskId"),
  body("startTime").notEmpty().withMessage("Provide Start Time"),
  body("endTime").notEmpty().withMessage("Provide End Time"),
];
router.post("/time-start", timeStartValidation, async (request, response) => {
  const validationError = validationResult(request);
  if (!validationError.isEmpty()) {
    return response.status(400).json({
      errors: validationError.array(),
    });
  }
  try {
    // const { taskId } = request.query;
    const { taskId, startTime, endTime } = request.body;
    const ServiceInstance = await new TaskServices();
    const result = await ServiceInstance.timeDuration(
      taskId,
      startTime,
      endTime
    );
    response.status(200).send(result);
  } catch (error) {
    console.log(error);
    response.status(400).send(error);
  }
});

router.post(
  "/completition-rate",
  new AuthenticationMiddleware().isAuthenticate,
  async (request, response) => {
    try {
      const user = request.user;
      const ServiceInstance = await new TaskServices();
      const result = await ServiceInstance.completitionRate();
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

export { router as taskRoutes };
