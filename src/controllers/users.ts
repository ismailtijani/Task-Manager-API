import { Response, RequestHandler } from "express";
import Logging from "../library/loggings";
import AppError from "../library/service";
import { responseStatusCodes, IUser, IUserModel } from "../library/types";
import User from "../models/user";

class controller {
  public createUser: RequestHandler = async (req, res, next) => {
    try {
      const email = (req.body as { email: IUser["email"] }).email;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        throw new AppError({
          message: "User already exist",
          statusCode: responseStatusCodes.UNPROCESSABLE,
        });

      const user = await User.create(req.body);
      const token = await user.generateAuthToken();

      res.status(201).json({
        STATUS: "SUCCESS",
        MESSAGE: "User created successfully",
        user,
        token,
      });
    } catch (error: any) {
      next(error);
    }
  };

  public userLogin: RequestHandler = async (req, res, next) => {
    try {
      const { email, password } = req.body as {
        email: IUser["email"];
        password: IUser["password"];
      };
      const user = await User.findByCredentials(email, password);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public readUser: RequestHandler = (req, res) => {
    res.status(200).json(req.user);
  };

  public updateUser: RequestHandler = async (req, res, next) => {
    const updates = Object.keys(req.body) as Array<Partial<keyof IUserModel>>;
    if (updates.length === 0)
      throw new AppError({
        message: "Invalid Update",
        statusCode: responseStatusCodes.BAD_REQUEST,
      });
    const allowedUpdates = ["name", "password", "email", "age"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation)
      throw new AppError({
        message: "Invalid Updates!",
        statusCode: responseStatusCodes.UNPROCESSABLE,
      });
    try {
      const user: any = req.user!;

      updates.forEach((update) => {
        user[update] = req.body[update];
      });
      await user.save();
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser: RequestHandler = async (req, res, next) => {
    try {
      await req.user?.delete();
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  };
}

const userController = new controller();

export default userController;
