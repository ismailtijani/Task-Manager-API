import { JwtPayload } from "jsonwebtoken";
import { Document, Model, Types } from "mongoose";
export enum responseStatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE = 422,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserModel;
      token?: string | JwtPayload;
    }
  }
}

export interface IUser {
  name: string;
  password: string;
  email: string;
  age?: number;
  tokens: object[];
  avatar: Buffer | undefined;
}

export interface IUserModel extends IUser, Document {
  tasks?: ITask[]; //PopulatedDoc<Document & ITask>; returns any
  generateAuthToken(): string;
}

export interface LoginModel extends Model<IUserModel> {
  findByCredentials(
    email: IUser["email"],
    password: IUser["password"]
  ): IUserModel;
}

export interface ITask {
  task: string;
  completed?: boolean;
  owner: Types.ObjectId;
}

export interface AppErrorArgs {
  name?: string;
  message: string;
  statusCode: responseStatusCodes;
  isOperational?: boolean;
}

export interface IMatch {
  completed: boolean;
}
