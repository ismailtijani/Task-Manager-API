import { RequestHandler } from "express";
import mongoose from "mongoose";
import Logging from "../library/loggings";

const mongoSetup: RequestHandler = (req, res, next) => {
  const mongoUrl = process.env.MONGODB_URL
    ? process.env.MONGODB_URL
    : `mongodb://127.0.0.1:27017`;

  mongoose.set("strictQuery", false);
  mongoose
    .connect(mongoUrl, { retryWrites: true, w: "majority" })
    .then(() => Logging.info("DB Connection Successful!"))
    .catch((error) => {
      next(error);
      // Logging.error("Unable to Connect to Database:");
      // Logging.error(err);
    });
};

export default mongoSetup;
