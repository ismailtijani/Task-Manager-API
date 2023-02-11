import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import taskrouter from "../routes/task";
import userRouter from "../routes/user";
import errorHandler from "../middleware/errorHandler";
import mongoSetup from "../database/db";

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    mongoSetup();
  }

  private config(): void {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,DELETE,PATCH,PUT",
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
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
