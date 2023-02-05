import bcrypt from "bcrypt";

import { Schema, model } from "mongoose";
import validator from "validator";
import AppError from "../library/service";
import jwt from "jsonwebtoken";
import {
  IUser,
  IUserModel,
  responseStatusCodes,
  LoginModel,
} from "../library/types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [7, "Password must be at least 7, got {VALUE}"],
      validate(value: string) {
        if (value.toLowerCase().includes("password"))
          throw new AppError({
            message: "You can't use the word password",
            statusCode: responseStatusCodes.BAD_REQUEST,
          });
      },
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
      validate(mail: string) {
        if (!validator.isEmail(mail))
          throw new AppError({
            message: "Invalid Email",
            statusCode: responseStatusCodes.BAD_REQUEST,
          });
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(age: number) {
        if (age < 0)
          throw new AppError({
            message: "Age must be a positive number",
            statusCode: responseStatusCodes.BAD_REQUEST,
          });
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// User and Task relationship
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

// User Token Generation
userSchema.methods.generateAuthToken = async function () {
  const user = this as IUserModel;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET as string
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//Login User Authentication
userSchema.statics.findByCredentials = async (
  email: IUserModel["email"],
  password: IUserModel["password"]
) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new AppError({
      message: "User does not exist",
      statusCode: responseStatusCodes.NOT_FOUND,
    });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new AppError({
      message: "Unable to login",
      statusCode: responseStatusCodes.BAD_REQUEST,
    });
  return user;
};

//Hashing User plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this as IUserModel;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model<IUserModel, LoginModel>("User", userSchema);
export default User;
