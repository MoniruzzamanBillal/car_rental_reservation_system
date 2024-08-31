import { userModel } from "./user.model";

// ! get all user from database
const getAllUserFromDb = async () => {
  const result = await userModel.find();

  return result;
};

//
export const userServices = {
  getAllUserFromDb,
};
