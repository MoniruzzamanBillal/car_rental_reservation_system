import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { userModel } from "../user/user.model";
import { TBooking } from "./booking.interface";
import mongoose from "mongoose";
import { carModel } from "../car/car.model";
import { CarStatus } from "../car/car.constant";
import { bookingModel } from "./booking.model";
import QueryBuilder from "../../builder/Queryuilder";

// ! creating a booking in database
const createBookInDb = async (payload: Partial<TBooking>) => {
  const { carId, ...requiredData } = payload;

  // requiredData.endTime = null;
  requiredData.totalCost = 0;

  // ! check if  user exist
  const user = await userModel.findById(payload.user);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User dont exist !!! ");
  }

  // ! check if  car exist
  const car = await carModel.findById(payload.car);

  if (!car) {
    throw new AppError(httpStatus.BAD_REQUEST, "car dont exist !!! ");
  }

  //! check if car is deleted
  const carIsDeleted = car?.isDeleted;
  if (carIsDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "This car is deleted !!! ");
  }

  // ! check if car is available or not
  const isCarAvailAble = car?.status;
  if (isCarAvailAble === CarStatus.unavailable) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This car is not available right now !!! "
    );
  }

  //   //! start a session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ! change car status to unavailable
    await carModel.findByIdAndUpdate(
      payload.car,
      { status: CarStatus.unavailable },
      { new: true }
    );

    const data = await bookingModel.create(requiredData);

    await session.commitTransaction();
    await session.endSession();

    return data;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }

  return null;
};

// ! get all booking (admin access)
const getAllBookingFromDb = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(bookingModel.find(), query)
    .filter()
    .sort();

  const result = await bookingQuery.queryModel.populate("user").populate("car");

  return result;
};

//
export const bookServices = {
  createBookInDb,
  getAllBookingFromDb,
};
