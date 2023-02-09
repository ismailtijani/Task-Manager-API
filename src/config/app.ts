import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import Logging from "../library/loggings";
import taskrouter from "../routes/task";
import userRouter from "../routes/user";
import errorHandler from "../middleware/errorHandler";

dotenv.config();

class App {
  public app: Application;

  public mongoUrl = process.env.MONGODB_URL
    ? process.env.MONGODB_URL
    : `mongodb://127.0.0.1:27017/Task-Manager-API`;

  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();
  }

  private mongoSetup(): void {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(this.mongoUrl, { retryWrites: true, w: "majority" })
      .then(() => Logging.info("DB Connection Successful!"))
      .catch((err) => {
        Logging.error("Unable to Connect to Database:");
        Logging.error(err);
      });
  }

  private config(): void {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,DELETE,PATCH,PUT",
        credentials: true,
      })
    );
    // this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    taskrouter(this.app);
    userRouter(this.app);
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.handleError(error, res);
      }
    );
  }
}

export const PORT = Number(process.env.SERVER_PORT) || 8000;
export default new App().app;
