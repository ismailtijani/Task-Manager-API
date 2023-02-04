import { RequestHandler } from "express";
import Logging from "../library/loggings";
import AppError from "../library/service";
import { IUserModel, responseStatusCodes } from "../library/types";
import Task from "../models/task";
import User from "../models/user";

class Controller {
  public createTask: RequestHandler = async (req, res, next) => {
    try {
      const newTask = await Task.create({ ...req.body, owner: req.user?._id });
      res.status(201).json({
        STATUS: "SUCCESS",
        MESSAGE: "Task Created successfully",
        TODO: newTask,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTasks: RequestHandler = async (req, res, next) => {
    try {
      const task = await Task.find({}); //Type for task
      if (task.length === 0)
        throw new AppError({
          message: "No task found",
          statusCode: responseStatusCodes.NOT_FOUND,
        });
      res.status(200).json({
        STATUS: "SUCCESS",
        MASSAGE: "Task retrieved",
        TASKS: task,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTaskById: RequestHandler = async (req, res, next) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        owner: req.user?._id,
      });
      if (!task)
        throw new AppError({
          message: "Task does not exist",
          statusCode: responseStatusCodes.NOT_FOUND,
        });

      res.status(200).json({
        STATUS: "SUCCESS",
        MESSAGE: "Retrieved task successfully",
        TASK: task,
      });
    } catch (error) {
      next(error);
    }
  };
  public updateTask: RequestHandler = async (req, res, next) => {
    try {
      const updates = Object.keys(req.body);
      if (updates.length === 0)
        throw new AppError({
          message: "Invalid Update",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      const allowedUpdated = ["task", "completed"];
      const isValidOperation = updates.every((update) =>
        allowedUpdated.includes(update)
      );
      if (!isValidOperation)
        throw new AppError({
          message: "Invalid Updates",
          statusCode: responseStatusCodes.UNPROCESSABLE,
        });

      const task: any = await Task.findById({
        _id: req.params.id,
        owner: req.user?._id,
      });
      updates.forEach((update) => (task[update] = req.body[update]));
      await task.save();
      res.status(200).send(task);
    } catch (error) {
      next(error);
    }
  };
}

export default Controller;
