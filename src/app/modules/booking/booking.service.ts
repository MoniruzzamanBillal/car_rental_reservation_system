import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { userModel } from "../user/user.model";
import { TBooking } from "./booking.interface";
import mongoose from "mongoose";
import { carModel } from "../car/car.model";
import { CarStatus } from "../car/car.constant";
import { bookingModel } from "./booking.model";
import QueryBuilder from "../../builder/Queryuilder";
import { bookingStatus } from "./booking.constant";

// ! creating a booking in database
const createBookInDb = async (payload: Partial<TBooking>) => {
  const { carId, ...requiredData } = payload;

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
      { new: true, session }
    );

    const createdBookingArray = await bookingModel.create([requiredData], {
      session,
    });

    const createdBooking = createdBookingArray[0];

    await createdBooking.populate({
      path: "user",
      select: " -password -createdAt -updatedAt -__v ",
    });

    await createdBooking.populate("car");

    await session.commitTransaction();
    await session.endSession();

    return createdBooking;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// ! get all booking (admin access)
const getAllBookingFromDb = async (query: Record<string, unknown>) => {
  const modifiedQuery = { ...query };

  if (modifiedQuery?.carId) {
    modifiedQuery.car = modifiedQuery?.carId;
    delete modifiedQuery?.carId;
  }

  const bookingQuery = new QueryBuilder(bookingModel.find(), modifiedQuery)
    .filter()
    .sort();

  const result = await bookingQuery.queryModel
    .populate({
      path: "user",
      select: "-password -createdAt  -updatedAt -__v -role ",
    })
    .populate("car");

  return result;
};

// ! get user's booking
const getUserBookingFromDb = async (id: string) => {
  const result = await bookingModel
    .find({ user: id })
    .populate({
      path: "user",
      select: " -password -createdAt -updatedAt -__v ",
    })
    .populate("car");

  return result;
};

// ! for changing booking status to approve
const approveBookingToDb = async (id: string) => {
  const bookingData = await bookingModel.findById(id);

  if (!bookingData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking data !! ");
  }

  const modifiedData = await bookingModel.findByIdAndUpdate(
    id,
    { status: bookingStatus.approved },
    { new: true, runValidators: true }
  );

  return modifiedData;
};

// ! for changing booking status to cancel
const cancelBookingToDb = async (id: string) => {
  const bookingData = await bookingModel.findById(id);

  if (!bookingData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking data !! ");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const carId = bookingData?.car.toString();

    //  *  for changing car status to availavle
    await carModel.findByIdAndUpdate(
      carId,
      { status: CarStatus.available },
      { new: true, runValidators: true, session }
    );

    const modifiedData = await bookingModel.findByIdAndUpdate(
      id,
      { status: bookingStatus.cancel },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
    return modifiedData;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error?.message);
  }
};

//
export const bookServices = {
  createBookInDb,
  getAllBookingFromDb,
  getUserBookingFromDb,
  approveBookingToDb,
  cancelBookingToDb,
};
