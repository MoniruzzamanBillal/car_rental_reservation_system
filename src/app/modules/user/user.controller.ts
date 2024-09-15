import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { userServices } from "./user.service";

// ! for getting all user from database
const getAllUser = catchAsync(async (req, res) => {
  const result = await userServices.getAllUserFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

// ! get single user
const getSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.getSpecificUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

//! get logged in user
const getLoggedInUser = catchAsync(async (req, res) => {
  const result = await userServices.getSpecificUser(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// ! change user role
const changeRole = catchAsync(async (req, res) => {
  const result = await userServices.changeUserRoleFromDb(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role changed successfully",
    data: result,
  });
});

//! update user data
const updateUser = catchAsync(async (req, res) => {
  const result = await userServices.updateUserFromDb(req.user.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

//
export const userControllers = {
  getAllUser,
  getSingleUser,
  changeRole,
  getLoggedInUser,
  updateUser,
};
