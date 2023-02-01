import app, { PORT } from "./config/app";
import http from "http";
import Logging from "./library/loggings";

const server = http
  .createServer(app)
  .listen(PORT, () => Logging.info(`Express server listening on port ${PORT}`));

process.on("uncaughtException", (error: Error) => {
  Logging.warn(`Uncaught Exception: ${error.stack}`);

  // errorHandler.handleError(error);
});

process.on("unhandledRejection", (err: Error, promise) => {
  Logging.error(`Unhandled Rejection: ${err.message}`);
  Logging.error(err.name);
  Logging.error(err.stack);
  // close server
  server.close(() => process.exit(1));
});
