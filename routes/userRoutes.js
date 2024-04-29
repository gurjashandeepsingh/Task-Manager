import { body, query, validationResult } from "express-validator";
import UserService from "../services/userServices.js";
import { logger } from "../winstonLogger.js";
import express from "express";
const router = express.Router();

const registerUserValidation = [
  body("email").toLowerCase().notEmpty().isEmail().withMessage("Email missing"),
  body("password").notEmpty().withMessage("Password Missing"),
  body("confirmPassword").notEmpty().withMessage("please confirm password"),
  body("username").notEmpty().withMessage("Username Missing"),
];
router.post(
  "/registerUser",
  registerUserValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { email, password, confirmPassword, username } = request.body;
      const ServiceInstance = await new UserService();
      const result = await ServiceInstance.registerUser(
        email,
        password,
        confirmPassword,
        username
      );
      return response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      return response.status(400).send("Error While fetching");
    }
  }
);

const loginUserValidation = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid Email address"),
  body("password").notEmpty().withMessage("Please provide password"),
];
router.post("/loginUser", loginUserValidation, async (request, response) => {
  const validationError = validationResult(request);
  if (!validationError.isEmpty()) {
    return response.status(400).json({
      errors: validationError.array(),
    });
  }
  try {
    const { email, password } = request.body;
    const ServiceInstance = new UserService();
    const result = await ServiceInstance.loginUser(email, password);
    console.log(result);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
    logger.error(error);
  }
});

export { router as userRoutes };
