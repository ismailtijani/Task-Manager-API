import mongoose from "mongoose";
import Logging from "../library/loggings";
import { server } from "../server";

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
    server()
  } catch (error:any) {
    Logging.error("Unable to Connect to Database, Server is not running")
    Logging.error(error);
    process.exit(1)
  }
};

export default mongoSetup;
