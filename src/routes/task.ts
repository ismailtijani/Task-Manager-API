import { Router, Application } from "express";
import Controller from "../controllers/task";
import joiSchema from "../library/schema";
import validator from "../middleware/validator";
import auth from "../middleware/auth";

export class TaskRoutes {
  public router: Router;

  private TaskController: Controller = new Controller();

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.post(
      "/",
      validator(joiSchema.creatTask, "body"),
      auth,
      this.TaskController.createTask
    );
    this.router.get("/", auth, this.TaskController.getTasks);
    this.router.get("/:id", auth, this.TaskController.getTaskById);
    this.router.patch(
      "/update/:id",
      validator(joiSchema.updateTask, "body"),
      auth,
      this.TaskController.updateTask
    );
    this.router.delete(
      "/delete/:id",
      validator(joiSchema.findTaskById, "params"),
      auth,
      this.TaskController.deleteTask
    );
  }
}

// Register TaskRouster in App
const taskrouter = (server: Application): void => {
  server.use("/task", new TaskRoutes().router);
};

export default taskrouter;
