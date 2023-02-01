import { Schema, model } from "mongoose";
import { ITask } from "../library/types";

const taskSchema = new Schema<ITask>(
  {
    task: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strictQuery: true, strict: true }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;
