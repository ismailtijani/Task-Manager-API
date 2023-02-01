import { Application, Router } from "express";
import userController from "../controllers/users";
import validator from "../middleware/validator";
import joiSchema from "../library/schema";
import auth from "../middleware/auth";

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.registeredRoutes();
  }

  protected registeredRoutes() {
    this.router.post(
      "/register",
      validator(joiSchema.creatUser, "body"),
      userController.createUser
    );
    this.router.post(
      "/login",
      validator(joiSchema.loginUser, "body"),
      userController.userLogin
    );
    this.router.get("/profile", auth, userController.readUser);
    this.router.patch("/update", auth, userController.updateUser);
  }
}

// Register User routes in App
const userRouter = (app: Application) => {
  app.use("/user", new UserRoutes().router);
};

export default userRouter;
