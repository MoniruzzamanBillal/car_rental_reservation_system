import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { userModel } from "./user.model";

// ! get all user from database
const getAllUserFromDb = async () => {
  const result = await userModel.find().select("-password");

  return result;
};

// ! get single user
const getSpecificUser = async (payload: string) => {
  const isUserExist = await userModel.findById(payload).select("-password");

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist !! ");
  }

  if (isUserExist?.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is blocked by admin !!! ");
  }

  return isUserExist;
};

//
export const userServices = {
  getAllUserFromDb,
  getSpecificUser,
};
