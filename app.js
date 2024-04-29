import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { userRoutes } from "./routes/userRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";
import { logger } from "./winstonLogger.js";

const app = express();
const baseURL = "/api";
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(`${baseURL}/user`, userRoutes);
app.use(`${baseURL}/task`, taskRoutes);

function mongoDBConnection() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/TaskManager-Database", {
      useNewUrlParser: true,
      autoCreate: true,
    })
    .then(() => {
      logger.info(`Connected to Database MongoDB: TaskManager-Database`);
    })
    .catch((error) => {
      logger.error(error);
    });
}

function serverStart() {
  app.listen(port, () => {
    logger.info(`Server is running at port ${port}`);
  });
}

function appStartup() {
  mongoDBConnection();
  serverStart();
}

appStartup();
