import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { authServices } from "./auth.service";

//  !  create user
const createUser = catchAsync(async (req, res) => {
  const result = await authServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully ",
    data: result,
  });
});

// ! signin
const signIn = catchAsync(async (req, res) => {
  const result = await authServices.signInFromDb(req.body);

  const { token } = result;

  const modifiedToken = `Bearer ${token}`;

  console.log(modifiedToken);

  res.cookie("token", modifiedToken, {
    secure: false,
    httpOnly: false,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully ",
    data: result,
  });
});

//
export const authController = {
  createUser,
  signIn,
};
