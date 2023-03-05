import app, { PORT } from "./config/app";
import http from "http";
import Logging from "./library/loggings";

export function server() {
  return http
    .createServer(app)
    .listen(PORT, () =>
      Logging.info(`Express server listening on port ${PORT}`)
    );
}

process.on("uncaughtException", (error: Error) => {
  Logging.warn(`Uncaught Exception: ${error.stack}`);
});

process.on("unhandledRejection", (err: Error) => {
  Logging.error(`Unhandled Rejection: ${err}`);
});
