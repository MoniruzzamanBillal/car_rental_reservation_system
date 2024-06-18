import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { TUser } from "../user/user.interface";
import { userModel } from "../user/user.model";
import { Tlogin } from "./auth.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import { createToken } from "./auth.util";

// ! create user in database
const createUserIntoDB = async (payload: TUser) => {
  const result = await userModel.create(payload);

  return result;
};

// ! sign in
const signInFromDb = async (payload: Tlogin) => {
  const user = await userModel.findOne({ email: payload?.email });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User dont exist with this email !!!"
    );
  }

  const isPasswordMatch = await bcrypt.compare(
    payload?.password,
    user?.password
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password don't match !!");
  }

  const userId = user?._id.toHexString();
  const userRole = user?.role;

  const jwtPayload = {
    userId,
    userRole,
  };

  const token = createToken(jwtPayload, config.jwt_secret as string, "10d");

  return {
    user,
    token,
  };

  //
};

//
export const authServices = {
  createUserIntoDB,
  signInFromDb,
};
