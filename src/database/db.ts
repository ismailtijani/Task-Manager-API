import { RequestHandler } from "express";
import mongoose from "mongoose";
import Logging from "../library/loggings";

const mongoSetup = async () => {
  const mongoUrl = process.env.MONGODB_URL
    ? process.env.MONGODB_URL
    : `mongodb://127.0.0.1:27017/Task-Manager-API`;

  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(mongoUrl, {
      retryWrites: true,
      w: "majority",
    });
    Logging.info("DB Connection Successful!");
  } catch (error) {
    Logging.error("Unable to Connect to Database:");
    Logging.error(error);
  }
};

export default mongoSetup;
