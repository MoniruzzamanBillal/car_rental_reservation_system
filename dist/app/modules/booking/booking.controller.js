"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const sendResponse_1 = __importDefault(require("../../util/sendResponse"));
const booking_service_1 = require("./booking.service");
// ! create booking
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const user = req.user;
    data.user = user === null || user === void 0 ? void 0 : user.userId;
    data.car = data === null || data === void 0 ? void 0 : data.carId;
    const result = yield booking_service_1.bookServices.createBookInDb(data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Car booked successfully",
        data: result,
    });
}));
// ! get all booking
const getAllBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.getAllBookingFromDb(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
    });
}));
// ! get all completed booking
const getAllCompleteedBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.getAllCompletedBookign();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Completed Bookings retrieved successfully",
        data: result,
    });
}));
// ! get all payment  completed booking
const getAllPaymentCompletedBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { range } = req.query;
    const result = yield booking_service_1.bookServices.getAllCompletedPaymentBookignFromDb(range);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Completed Payment Bookings retrieved successfully",
        data: result,
    });
}));
// ! for getting specific booking data
const getSpecificBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.getSpecificBookingFromDb(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrived successfully ",
        data: result,
    });
}));
//  ! get user booking
const getBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.getUserBookingFromDb(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
    });
}));
// ! for updating booking data
const updateBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.updateBookingFromDb(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Booking Updated successfully ",
        data: result,
    });
}));
// ! for approving booking  data
const approveBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.approveBookingToDb(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Booking Approved successfully ",
        data: result,
    });
}));
// ! for canceling booking
const cancelBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.cancelBookingToDb(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Booking canceled successfully ",
        data: result,
    });
}));
// ! for compleating booking
const compleatingBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.completeBooking(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Booking completed ",
        data: result,
    });
}));
//  ! get user completed booking
const getUserCompletedBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookServices.getUserCompletedBookingFromDb(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: " user completed Bookings retrieved successfully",
        data: result,
    });
}));
//
exports.bookingController = {
    createBooking,
    getAllBooking,
    getBooking,
    approveBooking,
    cancelBooking,
    compleatingBooking,
    getAllCompleteedBooking,
    getSpecificBooking,
    updateBooking,
    getUserCompletedBooking,
    getAllPaymentCompletedBooking,
};
