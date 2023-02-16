import mongoose, { isValidObjectId } from "mongoose";
import Logging from "../library/loggings";

const ObjectId = mongoose.Types.ObjectId;
export default function validObjectId(id: any) {
  if (isValidObjectId(id)) {
    Logging.info(String(new ObjectId(id)));
    if (String(new ObjectId(id)) === id) {
      return true;
    }
    return false;
  }
  return false;
}
