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
    this.router.get("/profile", auth, userController.readUser);
    this.router.patch("/update", auth, userController.updateUser);
    this.router.post("/logout", auth, userController.userLogout);
    this.router.post("/logoutall", auth, userController.userLogoutAll);
    this.router.delete("/delete", auth, userController.deleteUser);
    this.router.post(
      "/profile/avatar",
      auth,
      upload.single("avatar"),
      userController.uploadAvatar
    );
    this.router.get("/profile/avatar", auth, userController.getAvatar);
    this.router.delete(
      "/profile/avatar/delete",
      auth,
      userController.deleteAvatar
    );
  }
}

// Register User routes in App
const userRouter = (app: Application) => {
  app.use("/user", new UserRoutes().router);
};

export default userRouter;
