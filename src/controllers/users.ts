import { Response, RequestHandler } from "express";
import { UserInfo } from "os";
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
    if (updates.length === 0 || !req.user) return;
    const allowedUpdates = ["name", "password", "email", "age"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation)
      throw new AppError({
        message: "Invalid Updates!",
        statusCode: responseStatusCodes.UNPROCESSABLE,
      });

    let updateUser: Partial<IUser> = {};

    updates.forEach((update) => {
      updateUser[update as keyof typeof updateUser] = req.body[update];
    });

    try {
      const findUser = await User.findOne({ _id: req.user._id });
      findUser.name = updateUser.name;
      const updatedUser = await User.updateOne(
        updateUser,
        { _id: req.user?._id },
        { new: true }
      );

      res.status(200).send(updatedUser);
    } catch (error) {
      next();
    }
  };
}

const userController = new controller();

export default userController;
