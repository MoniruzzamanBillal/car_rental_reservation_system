import NoDataFound from "../../util/NoDataFound";
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

  // ! if no data found
  if (result.length <= 0) {
    return NoDataFound(res);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

//  ! get user booking
const getBooking = catchAsync(async (req, res) => {
  const result = await bookServices.getUserBookingFromDb(req.user.userId);

  if (result.length <= 0) {
    return NoDataFound(res);
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
  getBooking,
};
