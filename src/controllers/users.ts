import { RequestHandler } from "express";
import AppError from "../library/service";
import { responseStatusCodes, IUser, IUserModel } from "../library/types";
import User from "../models/user";
import sharp from "sharp";
import Email from "../emails/account";

class controller {
  public createUser: RequestHandler = async (req, res, next) => {
    const { email, name } = req.body as {
      email: IUser["email"];
      name: IUser["name"];
    };
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        throw new AppError({
          message: "User already exist",
          statusCode: responseStatusCodes.UNPROCESSABLE,
        });

      const user = await User.create(req.body);
      const token = await user.generateAuthToken();

      // Email.welcomeEmail(email, name);
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
      const token = await user.generateAuthToken();

      res.status(200).json({ user, token });
    } catch (error) {
      next(error);
    }
  };

  public userLogout: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      //Checking through the user tokens to filter out the one that was used for auth on the device
      user.tokens = user.tokens.filter(
        (token: any) => token.token !== req.token
      );
      await user.save();
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  //Logout from All devices
  public userLogoutAll: RequestHandler = async (req, res, next) => {
    const user = req.user!;
    user.tokens = [];
    await user.save();
    res.status(200).send();
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

  public uploadAvatar: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      const buffer = await sharp(req.file?.buffer)
        .resize(250, 300)
        .png()
        .toBuffer();

      user.avatar = buffer;
      await user.save();

      res.status(200).send();
    } catch (error: any) {
      next(error);
    }
  };

  public getAvatar: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user || !user.avatar)
        throw new AppError({
          message: "No avatar uploaded",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      res.set("Content-Type", "Image/png");
      res.status(200).send(user.avatar);
    } catch (error) {
      next(error);
    }
  };

  public deleteAvatar: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user!;
      user.avatar = undefined;
      await user.save();
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  public deleteUser: RequestHandler = async (req, res, next) => {
    const user = req.user!;
    try {
      await user.delete();
      // Email.cancelationEmail(user.name, user.email);
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  };
}

const userController = new controller();

export default userController;
