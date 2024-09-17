import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { bookingModel } from "../booking/booking.model";
import { bookingStatus } from "../booking/booking.constant";
import { userModel } from "../user/user.model";
import { carModel } from "../car/car.model";
import { initiatePayment, verifyPay } from "./payment.util";

// ! for payament
const procedePayment = async (id: string) => {
  const bookingData = await bookingModel.findById(id);

  // ! check if booking data exist
  if (!bookingData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking data !! ");
  }

  // ! check if booking status is completed
  if (bookingData?.status !== bookingStatus.completed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This booking is not completed !! "
    );
  }

  // ! check if  user exist
  const checkUser = await userModel.findById(bookingData?.user);

  if (!checkUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User dont exist !!! ");
  }

  // ! check if  car exist
  const checkCar = await carModel.findById(bookingData?.car);

  if (!checkCar) {
    throw new AppError(httpStatus.BAD_REQUEST, "car dont exist !!! ");
  }

  //! check if car is deleted
  const carIsDeleted = checkCar?.isDeleted;
  if (carIsDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "This car is deleted !!! ");
  }

  const { totalCost, transactionId } = bookingData;
  const { name, email, phone } = checkUser;

  const tracsactionData = {
    transactionId: transactionId,
    amount: totalCost,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
  };

  const transactionResult = await initiatePayment(tracsactionData);

  if (transactionResult?.tran_id) {
    throw new AppError(httpStatus.BAD_REQUEST, transactionResult?.tran_id);
  }

  return transactionResult;
};

// ! for verifying payment
const verifyPayment = async (transactionId: string) => {
  const verifyResult = await verifyPay(transactionId);

  if (verifyResult && verifyResult?.pay_status === "Successful") {
    await bookingModel.findOneAndUpdate(
      { transactionId },
      {
        payment: "complete",
      },
      { new: true }
    );
  }

  return verifyResult;
};

//
export const paymentServices = {
  procedePayment,
  verifyPayment,
};
