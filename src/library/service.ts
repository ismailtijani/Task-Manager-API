import { responseStatusCodes, AppErrorArgs } from "./types";

export default class AppError extends Error {
  public readonly name: string;
  public readonly statusCode: responseStatusCodes;
  public readonly isOperational?: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || "Error";
    this.statusCode = args.statusCode;

    if (args.isOperational) this.isOperational === args.isOperational;

    Error.captureStackTrace(this);
  }
}

// export class CommonService {
//   public static successResponse(res: Response, DATA?: any) {
//     res.status(responseStatusCodes.SUCCESS).json({
//       STATUS: "SUCCESS",
//       DATA,
//     });
//   }

//   public static createdResponse(message: string, DATA: any, res: Response) {
//     res.status(responseStatusCodes.CREATED).json({
//       STATUS: "SUCCESS",
//       MESSAGE: message,
//       DATA,
//     });
//   }

//   public static failureResponse(message: string, res: Response, DATA?: any) {
//     Logging.error(message);
//     res.status(responseStatusCodes.BAD_REQUEST).json({
//       STATUS: "FAILURE",
//       MESSAGE: message,
//       DATA,
//     });
//   }

//   public static unAuthorizedResponse(message: string, res: Response) {
//     res.status(responseStatusCodes.UNAUTHORIZED).json({
//       STATUS: "FAILURE",
//       MESSAGE: message,
//     });
//   }

//   public static insufficientParameters(res: Response) {
//     res.status(responseStatusCodes.BAD_REQUEST).json({
//       STATUS: "FAILURE",
//       MESSAGE: "Insufficient parameters",
//       DATA: {},
//     });
//   }

//   public static mongoError(err: any, res: Response) {
//     res.status(responseStatusCodes.INTERNAL_SERVER_ERROR).json({
//       STATUS: "FAILURE",
//       MESSAGE: "MongoDB error",
//       DATA: err,
//     });
//   }
//   public static notFoundResponse(message: string, res: Response) {
//     res.status(responseStatusCodes.NOT_FOUND).json({
//       STATUS: "FAILURE",
//       MESSAGE: message,
//     });
//   }
// }

// export default CommonService;
// export class ErrorResponse {
//   public statusCode;
//   constructor(message: string, statusCode: number) {
//     // super(message);
//     this.statusCode = statusCode;
//   }
// }
