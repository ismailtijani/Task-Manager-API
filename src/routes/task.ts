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
    this.router.use(auth);
    this.router.post(
      "/",
      validator(joiSchema.creatTask, "body"),
      this.TaskController.createTask
    );
    this.router.get("/", this.TaskController.getTasks);
    this.router.get("/:id", this.TaskController.getTaskById);
    this.router.patch(
      "/update/:id",
      validator(joiSchema.updateTask, "body"),
      this.TaskController.updateTask
    );
    this.router.delete(
      "/delete/:id",
      validator(joiSchema.findTaskById, "params"),
      this.TaskController.deleteTask
    );
  }
}

// Register TaskRouster in App
const taskrouter = (server: Application): void => {
  server.use("/task", new TaskRoutes().router);
};

export default taskrouter;
