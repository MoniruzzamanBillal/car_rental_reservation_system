import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { userModel } from "./user.model";
import { UserRole } from "./user.constant";

// ! get all user from database
const getAllUserFromDb = async () => {
  const result = await userModel.find().sort({ role: 1 }).select("-password");

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

// ! change user role from data base
const changeUserRoleFromDb = async (userId: string) => {
  const isUserExist = await userModel.findById(userId).select("-password");

  // * check if user exist in data basee
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist !! ");
  }

  if (isUserExist?.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is blocked by admin !!! ");
  }

  if (isUserExist?.role === UserRole.admin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This user is admin , you can't change the role !!! "
    );
  }

  const reesult = await userModel.findByIdAndUpdate(
    userId,
    { role: UserRole.admin },
    { new: true, runValidators: true }
  );

  return reesult;
};

//
export const userServices = {
  getAllUserFromDb,
  getSpecificUser,
  changeUserRoleFromDb,
};
