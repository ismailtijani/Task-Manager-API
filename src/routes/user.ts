import { Application, Router } from "express";
import userController from "../controllers/users";
import validator from "../middleware/validator";
import joiSchema from "../library/schema";
import auth from "../middleware/auth";
import upload from "../library/multer";

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

    //Using a single line of code for the authetication middleware"
    this.router.use(auth);
    this.router.get("/profile", userController.readUser);
    this.router.patch("/update", userController.updateUser);
    this.router.post("/logout", userController.userLogout);
    this.router.post("/logoutall", userController.userLogoutAll);
    this.router.delete("/delete", userController.deleteUser);
    this.router.post(
      "/profile/avatar",
      upload.single("avatar"),
      userController.uploadAvatar
    );
    this.router.get("/profile/avatar", userController.getAvatar);
    this.router.delete("/profile/avatar/delete", userController.deleteAvatar);
  }
}

// Register User routes in App
const userRouter = (app: Application) => {
  app.use("/user", new UserRoutes().router);
};

export default userRouter;
