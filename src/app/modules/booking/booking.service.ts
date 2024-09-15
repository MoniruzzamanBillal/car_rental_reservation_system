/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { userModel } from "../user/user.model";
import { TBooking, TCompleteBooking } from "./booking.interface";
import mongoose from "mongoose";
import { carModel } from "../car/car.model";
import { CarStatus } from "../car/car.constant";
import { bookingModel } from "./booking.model";
import QueryBuilder from "../../builder/Queryuilder";
import { bookingStatus } from "./booking.constant";
import { convertMinutes } from "../car/car.util";
import { subDays } from "date-fns";

// ! creating a booking in database
const createBookInDb = async (payload: Partial<TBooking>) => {
  const { carId, ...requiredData } = payload;

  const trxnNumber = `TXN-${Date.now()}`;

  requiredData.totalCost = 0;
  requiredData.transactionId = trxnNumber;

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

  const modifiedResult = result.sort((a: any, b: any) => {
    const order: Record<string, number> = {
      pending: 1,
      approved: 2,
      completed: 3,
    };
    return order[a.status] - order[b.status];
  });

  return modifiedResult;
  // return result;
};

// ! get completed booking from database
const getAllCompletedBookign = async () => {
  try {
    const completedBookings = await bookingModel
      .find({
        status: { $eq: "completed" },
      })
      .populate({
        path: "user",
        select: " -password -createdAt -updatedAt -__v ",
      })
      .populate({
        path: "car",
        match: { status: { $eq: "unavailable" } },
      });

    const filterData = completedBookings.filter((booking) => booking?.car);

    return filterData;
  } catch (error) {
    throw new Error("Error fetching completed bookings: " + error);
  }
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

  const midifiedBooking = result.sort((a: any, b: any) => {
    const order: Record<string, number> = {
      pending: 1,
      approved: 2,
      completed: 3,
    };

    return order[a.status] - order[b.status];
  });

  return midifiedBooking;
};

// ! get specific booking
const getSpecificBookingFromDb = async (id: string) => {
  const result = await bookingModel.findById(id);

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

  //  * check if booking status is completed
  if (bookingData?.status === bookingStatus.completed) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Booking is completed");
  }

  //  * check if booking status is cancel
  if (bookingData?.status === bookingStatus.cancel) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Booking is already canceled"
    );
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

// ! for finishing booking
const completeBooking = async (payload: TCompleteBooking) => {
  const { bookingId, endTime } = payload;

  const bookingResult = await bookingModel.findById(bookingId);

  // * check if booking is exist
  if (!bookingResult) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Booking not exist");
  }

  //  * check if booking status is completed
  if (bookingResult?.status === bookingStatus.completed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Booking is already completed"
    );
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

    // * update end time , total cost , booking status
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

// ! for updating  booking data
const updateBookingFromDb = async (id: string, payload: Partial<TBooking>) => {
  const bookingData = await bookingModel.findById(id);

  if (!bookingData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking data !! ");
  }

  //  * check if booking status is completed
  if (bookingData?.status === bookingStatus.completed) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Booking is completed");
  }

  //  * check if booking status is cancel
  if (bookingData?.status === bookingStatus.cancel) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Booking is already canceled"
    );
  }

  const result = await bookingModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// ! get user booking which are completed
const getUserCompletedBookingFromDb = async (id: string) => {
  const result = await bookingModel
    .find({ user: id, status: "completed" })
    .populate({
      path: "user",
      select: " -password -createdAt -updatedAt -__v ",
    })
    .populate("car");

  const successResult = result.filter(
    (item) => item?.status === bookingStatus.completed
  );

  const modifiedResult = successResult.sort((a: any, b: any) => {
    const order: Record<string, number> = {
      pending: 1,
      complete: 2,
    };

    return order[a.payment] - order[b.payment];
  });

  return modifiedResult;
};

// ! get all completed payment data for showing in chart
const getAllCompletedPaymentBookignFromDb = async (range: string) => {
  try {
    const today = new Date();
    let dateRange;

    if (range === "thirty") {
      dateRange = subDays(today, 30);
    } else if (range === "seven") {
      dateRange = subDays(today, 7);
    } else {
      dateRange = subDays(today, 60);
    }

    console.log(dateRange);

    const completedBookings = await bookingModel
      .find({
        status: { $eq: "completed" },
        payment: { $eq: "complete" },
        // updatedAt : {$gte :dateRange }
      })
      .select({
        updatedAt: 1,
        totalCost: 1,
      })
      .sort({ _id: -1 });

    const formatDate = (dateString: Date) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
      };
      return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
    };

    const modifiedData = completedBookings?.map((item) => ({
      ...item.toObject(),
      updatedAt: formatDate(item.updatedAt!),
    }));

    // *  Define the type for accumulator
    type TAggregatedData = {
      [date: string]: { updatedAt: string; amount: number };
    };

    const aggregatedData = modifiedData.reduce((acc: TAggregatedData, item) => {
      const date = item.updatedAt;

      if (!acc[date]) {
        acc[date] = { updatedAt: date, amount: 0 };
      }

      acc[date].amount += item.totalCost;

      console.log(acc);

      return acc;
    }, {});

    const modifiedAggregatedData = Object.values(aggregatedData);

    return modifiedAggregatedData;
  } catch (error) {
    throw new Error("Error fetching completed payment bookings: " + error);
  }
};

//
export const bookServices = {
  createBookInDb,
  getAllBookingFromDb,
  getUserBookingFromDb,
  approveBookingToDb,
  cancelBookingToDb,
  completeBooking,
  getAllCompletedBookign,
  getSpecificBookingFromDb,
  updateBookingFromDb,
  getUserCompletedBookingFromDb,
  getAllCompletedPaymentBookignFromDb,
};
