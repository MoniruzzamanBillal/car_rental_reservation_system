import { TCar } from "./car.interface";
import { carModel } from "./car.model";

// ! create car in database
const createCarIntoDB = async (payload: TCar) => {
  const result = await carModel.create(payload);
  return result;
};

//
export const carServices = {
  createCarIntoDB,
};
