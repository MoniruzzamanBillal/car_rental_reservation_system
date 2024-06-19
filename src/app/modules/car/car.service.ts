import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { TCar } from "./car.interface";
import { carModel } from "./car.model";
import { TReturnCar } from "../booking/booking.interface";
import { bookingModel } from "../booking/booking.model";
import { userModel } from "../user/user.model";
import { convertMinutes } from "./car.util";
import mongoose from "mongoose";
import { CarStatus } from "./car.constant";

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

// ! return booked car from databbase
const returnBookedCar = async (payload: TReturnCar) => {
  const { bookingId, endTime } = payload;

  const bookingResult = await bookingModel.findById(bookingId);

  console.log(bookingResult);

  // ! check if booking is exist
  if (!bookingResult) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Booking not exist");
  }

  const { user: userId, car: carId, startTime } = bookingResult;

  // ! check if user is exist
  const user = await userModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user don't exist");
  }

  // ! check if car is exist
  const car = await carModel.findById(carId);
  if (!car) {
    throw new AppError(httpStatus.BAD_REQUEST, "This car don't exist");
  }
  // ! check if car is deleted
  if (car.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This car is deleted ");
  }
  console.log(car);
  const { pricePerHour } = car;

  const startMinutes = convertMinutes(startTime);
  const endMinutes = convertMinutes(endTime);

  // ! check if end time is greater than start time
  if (startMinutes >= endMinutes) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End time can't be equal to or less than start time "
    );
  }

  const totalCost = ((endMinutes - startMinutes) / 60) * pricePerHour;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ! update car status
    await carModel.findByIdAndUpdate(
      carId,
      {
        status: CarStatus.available,
      },
      { new: true, upsert: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }

  //
};

//
export const carServices = {
  createCarIntoDB,
  getAllCarDataFromDb,
  getSingleCarFromDb,
  deleteCarFromDatabase,
  returnBookedCar,
};
