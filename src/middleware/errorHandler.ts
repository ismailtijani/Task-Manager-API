import { Response } from "express";
import Logging from "../library/loggings";
import AppError from "../library/service";
import { responseStatusCodes } from "../library/types";

export class ErrorHandler {
  private isTrustedError(error: Error | AppError) {
    if (error instanceof AppError) return true;
    return false;
  }

  public handleError(error: Error | AppError, res?: Response) {
    if (this.isTrustedError(error)) {
      this.handleTrustedError(error as AppError, res as Response);
    } else {
      this.handleCriticalError(error as Error, res);
    }
  }
  private handleTrustedError = (error: AppError, res: Response) => {
    return res
      .status(error.statusCode)
      .json({ STATUS: "FAILURE", MESSAGE: error.message });
  };
  private handleCriticalError(error: Error, res?: Response) {
    Logging.error(error);
    if (res) {
      res.status(responseStatusCodes.BAD_REQUEST).json({
        STATUS: "FAILURE",
        MESSAGE: { name: error.name, message: error.message },
      });
      res.status(responseStatusCodes.INTERNAL_SERVER_ERROR).json({
        STATUS: "FAILURE",
        MESSAGE: "Internal Server Error",
      });
      process.exit(1);
    }
  }
}

const errorHandler = new ErrorHandler();
export default errorHandler;
