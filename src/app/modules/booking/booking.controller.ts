import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { bookServices } from "./booking.service";

// ! create booking
const createBooking = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;

  data.user = user?.userId;
  data.car = data?.carId;

  const result = await bookServices.createBookInDb(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car booked successfully",
    data: result,
  });
});

// ! get all booking
const getAllBooking = catchAsync(async (req, res) => {
  const result = await bookServices.getAllBookingFromDb(req.query);

  if (result.length <= 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No Data Found",
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

//
export const bookingController = {
  createBooking,
  getAllBooking,
};
