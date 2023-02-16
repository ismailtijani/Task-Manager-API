import { RequestHandler } from "express";
import AppError from "../library/service";
import { ITask, responseStatusCodes } from "../library/types";
import Task from "../models/task";
import validObjectId from "../middleware/validId";

interface IMatch {
  completed: boolean;
}

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

  //GET /tasks?completed=true
  //GET /tasks?limit=2&skip=2
  //GET /tasks?sortBy=createdAt:desc or /tasks?sortBy=completed_asc
  public getTasks: RequestHandler = async (req, res, next) => {
    const match = {} as IMatch;
    const sort: any = {};

    if (req.query.completed) match.completed = req.query.completed === "true";
    if (req.query.sortBy) {
      const splitted = (req.query.sortBy as string).split(":");
      sort[splitted[0]] = splitted[1] === "desc" ? -1 : 1;
    }
    try {
      await req.user?.populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit as string),
          skip: parseInt(req.query.skip as string),
          sort,
        },
      });
      const tasks = req.user?.tasks as ITask[];
      if (tasks.length === 0)
        throw new AppError({
          message: "No task found",
          statusCode: responseStatusCodes.NOT_FOUND,
        });
      res.status(200).json({
        STATUS: "SUCCESS",
        MASSAGE: "Task retrieved",
        TASKS: tasks,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTaskById: RequestHandler = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!validObjectId(id))
        throw new AppError({
          message: "Invalid Id",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      const task = await Task.findOne({ id, owner: req.user?._id });
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
    try {
      const id = req.params.id;
      if (!validObjectId(id))
        throw new AppError({
          message: "Invalid Id",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      const task: any = await Task.findById({ id, owner: req.user?._id });
      if (!task)
        throw new AppError({
          message: "Invalid Update",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });

      updates.forEach((update) => (task[update] = req.body[update]));
      await task.save();
      res.status(200).send(task);
    } catch (error) {
      next(error);
    }
  };
  public deleteTask: RequestHandler = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!validObjectId(id))
        throw new AppError({
          message: "Invalid Id",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      const task = await Task.findOneAndDelete({ id, owner: req.user?._id });
      if (!task)
        throw new AppError({
          message: "Invalid Request",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };
}

export default Controller;
