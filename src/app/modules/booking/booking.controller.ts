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
// ! get all completed booking
const getAllCompleteedBooking = catchAsync(async (req, res) => {
  const result = await bookServices.getAllCompletedBookign();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Completed Bookings retrieved successfully",
    data: result,
  });
});

// ! for getting specific booking data
const getSpecificBooking = catchAsync(async (req, res) => {
  const result = await bookServices.getSpecificBookingFromDb(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking retrived successfully ",
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

// ! for approving booking  data
const approveBooking = catchAsync(async (req, res) => {
  const result = await bookServices.approveBookingToDb(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking Approved successfully ",
    data: result,
  });
});

// ! for canceling booking
const cancelBooking = catchAsync(async (req, res) => {
  const result = await bookServices.cancelBookingToDb(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking canceled successfully ",
    data: result,
  });
});

// ! for compleating booking
const compleatingBooking = catchAsync(async (req, res) => {
  const result = await bookServices.completeBooking(req.body);

  if (!result) {
    return NoDataFound(res);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking completed ",
    data: result,
  });
});

//
export const bookingController = {
  createBooking,
  getAllBooking,
  getBooking,
  approveBooking,
  cancelBooking,
  compleatingBooking,
  getAllCompleteedBooking,
  getSpecificBooking,
};
