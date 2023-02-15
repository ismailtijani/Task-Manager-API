import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../library/service";
import { IUserModel, responseStatusCodes } from "../library/types";
import User from "../models/user";

interface IDecode {
  _id: string;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      throw new AppError({
        message: "Please authenticate",
        statusCode: responseStatusCodes.UNAUTHORIZED,
      });
    const decoded = <IDecode>(
      jwt.verify(token, process.env.JWT_SECRET as string)
    );

    const user = await User.findOne<IUserModel>({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user)
      throw new AppError({
        message: "Please authenticate",
        statusCode: responseStatusCodes.UNAUTHORIZED,
      });

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
