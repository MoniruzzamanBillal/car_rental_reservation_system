import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { TCar } from "./car.interface";
import { carModel } from "./car.model";

// ! create car in database
const createCarIntoDB = async (payload: TCar) => {
  const result = await carModel.create(payload);
  return result;
};

// ! get all car cars from database
const getAllCarDataFromDb = async () => {
  return await carModel.find();
};

//  ! get single car data
const getSingleCarFromDb = async (id: string) => {
  const isDeleted = await carModel.isCarDeleted(id);

  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This car is deleted !!");
  }

  const result = await carModel.findById(id);

  return result;
};

// ! delete car from database ( soft delete )
const deleteCarFromDatabase = async (id: string) => {
  const carData = await carModel.isCarExist(id);

  if (!carData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Car data don't exist !!!!");
  }

  const isDeleted = await carModel.isCarDeleted(id);

  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This car is already deleted !!");
  }

  const result = await carModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

//
export const carServices = {
  createCarIntoDB,
  getAllCarDataFromDb,
  getSingleCarFromDb,
  deleteCarFromDatabase,
};
