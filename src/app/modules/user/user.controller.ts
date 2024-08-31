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

//
export const userControllers = {
  getAllUser,
};
