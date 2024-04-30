import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { userRoutes } from "./routes/userRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";
import { logger } from "./winstonLogger.js";

const app = express();
const baseURL = "/api";
const port = process.env.PORT || 3000;
const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/TaskManager-Database";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(`${baseURL}/user`, userRoutes);
app.use(`${baseURL}/task`, taskRoutes);

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      autoCreate: true,
    });
    logger.info(`Connected to MongoDB: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

function startServer() {
  app.listen(port, () => {
    logger.info(`Server is running at port ${port}`);
  });
}

async function startup() {
  await connectToDatabase();
  startServer();
}

startup();

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    logger.info("MongoDB connection closed due to app termination");
    process.exit(0);
  });
});
