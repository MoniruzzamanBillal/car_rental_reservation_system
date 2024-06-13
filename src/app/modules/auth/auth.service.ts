import { TUser } from "../user/user.interface";
import { userModel } from "../user/user.model";

// ! create user in database
const createUserIntoDB = async (payload: TUser) => {
  const result = await userModel.create(payload);

  return result;
};

//
export const authServices = {
  createUserIntoDB,
};
