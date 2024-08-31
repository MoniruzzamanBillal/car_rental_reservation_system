import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { authServices } from "./auth.service";

//  !  create user
const createUser = catchAsync(async (req, res) => {
  const result = await authServices.createUserIntoDB(req.body);

  console.log(result);

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

  const { token, user } = result;

  const modifiedToken = `Bearer ${token}`;

  const userObject = user.toObject() as any;
  delete userObject.password;

  res.cookie("token", modifiedToken, {
    secure: false,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  const data = {
    ...userObject,
  };

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully ",
    data: data,
    token: token,
  });
});

//
export const authController = {
  createUser,
  signIn,
};
