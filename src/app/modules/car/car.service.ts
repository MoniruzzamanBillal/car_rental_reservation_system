import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { TCar } from "./car.interface";
import { carModel } from "./car.model";
import { TReturnCar } from "../booking/booking.interface";
import { bookingModel } from "../booking/booking.model";
import { userModel } from "../user/user.model";
import { convertMinutes } from "./car.util";
import mongoose from "mongoose";
import { carSearchableFields, CarStatus } from "./car.constant";
import QueryBuilder from "../../builder/Queryuilder";
import { bookingStatus } from "../booking/booking.constant";
import { SendImageCloudinary } from "../../util/SendImageToCloudinary";

// ! create car in database
const createCarIntoDB = async (payload: TCar, file: any) => {
  //  console.log(payload);
  // console.log(file);

  const name = payload?.name;
  const path = file?.path;

  const carImgresult = await SendImageCloudinary(path, name);

  const carImg = carImgresult?.secure_url;

  const result = await carModel.create({ ...payload, carImg });
  return result;
};

// ! get all car cars from database
const getAllCarDataFromDb = async (query: Record<string, unknown>) => {
  const carQueryBuilder = carModel.find().sort({ status: 1 });

  const carQuery = new QueryBuilder(carQueryBuilder, query);

  const result = await carQuery.queryModel;

  return result;
};

// ! get all available cars from database
const getAllAvailableCarDataFromDb = async (query: Record<string, unknown>) => {
  if (query?.pricePerHour) {
    const { pricePerHour } = query;

    const priceQuery = carModel.find({
      status: CarStatus.available,
      pricePerHour: { $lte: pricePerHour },
    });

    const queryRes = new QueryBuilder(priceQuery, query)
      .search(carSearchableFields)
      .filter()
      .sort();

    const result = await queryRes.queryModel;

    return result;
  }

  const carQueryBuilder = carModel.find({ status: CarStatus.available });

  const carQuery = new QueryBuilder(carQueryBuilder, query)
    .search(carSearchableFields)
    .filter()
    .sort();

  const result = await carQuery.queryModel;

  return result;
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

// ! updating car from database
const updateCarFromDatabase = async (id: string, payload: Partial<TCar>) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { features, ...remainingData } = payload;

    const modifiedData: Record<string, unknown> = {
      ...remainingData,
    };

    //  * update car feature
    if (features && features.length) {
      await carModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            features: { $each: features },
          },
        },
        { new: true, upsert: true, session }
      );
    }

    const result = await carModel.findByIdAndUpdate(id, modifiedData, {
      new: true,
      upsert: true,
      session,
    });

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }

  //
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

  // * check if booking is exist
  if (!bookingResult) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Booking not exist");
  }

  //  * check if booking status is cancel
  if (bookingResult?.status === bookingStatus.cancel) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Booking is already canceled"
    );
  }

  //  * check if booking status is pending
  if (bookingResult?.status === bookingStatus.pending) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Booking is not approved!! "
    );
  }

  const { user: userId, car: carId, startTime } = bookingResult;

  // * check if user is exist
  const user = await userModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user don't exist");
  }

  // * check if car is exist
  const car = await carModel.findById(carId);
  if (!car) {
    throw new AppError(httpStatus.BAD_REQUEST, "This car don't exist");
  }
  // * check if car is deleted
  if (car.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This car is deleted ");
  }

  const { pricePerHour } = car;

  const startMinutes = convertMinutes(startTime);
  const endMinutes = convertMinutes(endTime);

  // * check if end time is greater than start time
  if (startMinutes > endMinutes) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End time can't be less than start time "
    );
  }

  //  * check if starttime and endtime is same or not
  if (startMinutes === endMinutes) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End time can't be equal to start time "
    );
  }

  const totalCost = ((endMinutes - startMinutes) / 60) * pricePerHour;

  const session = await mongoose.startSession();

  // * transaction rollback starts
  try {
    session.startTransaction();

    // * update car status
    // await carModel.findByIdAndUpdate(
    //   carId,
    //   {
    //     status: CarStatus.available,
    //   },
    //   { new: true, upsert: true, session }
    // );

    // * update end time and total cost
    const result = await bookingModel
      .findByIdAndUpdate(
        bookingId,
        {
          endTime,
          totalCost,
          status: bookingStatus.completed,
        },
        { new: true, upsert: true, session }
      )
      .populate({
        path: "user",
        select: " -password -createdAt -updatedAt -__v  ",
      })
      .populate("car");

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }

  //
};

// ! changing car status to available
const changeStatusAvailable = async (id: string) => {
  // * check if car is exist
  const car = await carModel.findById(id);
  if (!car) {
    throw new AppError(httpStatus.BAD_REQUEST, "This car don't exist");
  }
  // * check if car is deleted
  if (car.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "This car is deleted ");
  }

  // * update car status
  const result = await carModel.findByIdAndUpdate(
    id,
    {
      status: CarStatus.available,
    },
    { new: true, upsert: true }
  );

  return result;
};

//
export const carServices = {
  createCarIntoDB,
  getAllCarDataFromDb,
  getSingleCarFromDb,
  deleteCarFromDatabase,
  returnBookedCar,
  updateCarFromDatabase,
  changeStatusAvailable,
  getAllAvailableCarDataFromDb,
};
