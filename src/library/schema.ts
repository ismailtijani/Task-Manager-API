import Joi from "joi";
import { ITask, IUser } from "./types";

const joiSchema = {
  creatUser: Joi.object<IUser>({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    age: Joi.number().min(1),
  }),
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
  }),
  creatTask: Joi.object<ITask>({
    task: Joi.string().required().trim(),
    completed: Joi.boolean().default(false),
  }),
  findTaskById: Joi.object({ id: Joi.string().trim().length(24).required() }),
};

export default joiSchema;
