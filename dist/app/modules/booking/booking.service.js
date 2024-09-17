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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const car_model_1 = require("../car/car.model");
const car_constant_1 = require("../car/car.constant");
const booking_model_1 = require("./booking.model");
const Queryuilder_1 = __importDefault(require("../../builder/Queryuilder"));
const booking_constant_1 = require("./booking.constant");
const car_util_1 = require("../car/car.util");
const date_fns_1 = require("date-fns");
// ! creating a booking in database
const createBookInDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = payload, requiredData = __rest(payload, ["carId"]);
    const trxnNumber = `TXN-${Date.now()}`;
    requiredData.totalCost = 0;
    requiredData.transactionId = trxnNumber;
    // requiredData.carStatus = CarStatus.unavailable;
    // ! check if  user exist
    const user = yield user_model_1.userModel.findById(payload.user);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User dont exist !!! ");
    }
    // ! check if  car exist
    const car = yield car_model_1.carModel.findById(payload.car);
    if (!car) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "car dont exist !!! ");
    }
    //! check if car is deleted
    const carIsDeleted = car === null || car === void 0 ? void 0 : car.isDeleted;
    if (carIsDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This car is deleted !!! ");
    }
    // ! check if car is available or not
    const isCarAvailAble = car === null || car === void 0 ? void 0 : car.status;
    if (isCarAvailAble === car_constant_1.CarStatus.unavailable) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This car is not available right now !!! ");
    }
    //   //! start a session
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // ! change car status to unavailable
        yield car_model_1.carModel.findByIdAndUpdate(payload.car, { status: car_constant_1.CarStatus.unavailable }, { new: true, session });
        const createdBookingArray = yield booking_model_1.bookingModel.create([requiredData], {
            session,
        });
        const createdBooking = createdBookingArray[0];
        yield createdBooking.populate({
            path: "user",
            select: " -password -createdAt -updatedAt -__v ",
        });
        yield createdBooking.populate("car");
        yield session.commitTransaction();
        yield session.endSession();
        return createdBooking;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
// ! get all booking (admin access)
const getAllBookingFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const modifiedQuery = Object.assign({}, query);
    if (modifiedQuery === null || modifiedQuery === void 0 ? void 0 : modifiedQuery.carId) {
        modifiedQuery.car = modifiedQuery === null || modifiedQuery === void 0 ? void 0 : modifiedQuery.carId;
        modifiedQuery === null || modifiedQuery === void 0 ? true : delete modifiedQuery.carId;
    }
    const bookingQuery = new Queryuilder_1.default(booking_model_1.bookingModel.find(), modifiedQuery)
        .filter()
        .sort();
    const result = yield bookingQuery.queryModel
        .populate({
        path: "user",
        select: "-password -createdAt  -updatedAt -__v -role ",
    })
        .populate("car");
    const modifiedResult = result.sort((a, b) => {
        const order = {
            pending: 1,
            approved: 2,
            completed: 3,
        };
        return order[a.status] - order[b.status];
    });
    return modifiedResult;
    // return result;
});
// ! get completed booking from database
const getAllCompletedBookign = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completedBookings = yield booking_model_1.bookingModel
            .find({
            status: { $eq: "completed" },
        })
            .populate({
            path: "user",
            select: " -password -createdAt -updatedAt -__v ",
        })
            .populate({
            path: "car",
            select: " -description",
        });
        return completedBookings;
    }
    catch (error) {
        throw new Error("Error fetching completed bookings: " + error);
    }
});
// ! get all completed booking but car status unavailable
const getCompletedBookingUnavailableCar = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.bookingModel
        .find({
        status: { $eq: "completed" },
        carStatus: { $eq: car_constant_1.CarStatus.unavailable },
    })
        .populate({
        path: "user",
        select: " -password -createdAt -updatedAt -__v ",
    })
        .populate({
        path: "car",
        select: " -description",
    });
    return result;
});
// ! get completed payment booking count   from database
const getAllCompletedPaymentBookigCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completedBookings = yield booking_model_1.bookingModel.find({
            status: { $eq: "completed" },
            payment: { $eq: "complete" },
        });
        return completedBookings;
    }
    catch (error) {
        throw new Error("Error fetching completed bookings: " + error);
    }
});
// ! get user's booking
const getUserBookingFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.bookingModel
        .find({ user: id })
        .populate({
        path: "user",
        select: " -password -createdAt -updatedAt -__v ",
    })
        .populate("car");
    const midifiedBooking = result.sort((a, b) => {
        const order = {
            pending: 1,
            approved: 2,
            completed: 3,
        };
        return order[a.status] - order[b.status];
    });
    return midifiedBooking;
});
// ! get specific booking
const getSpecificBookingFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.bookingModel.findById(id);
    return result;
});
// ! for changing booking status to approve
const approveBookingToDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = yield booking_model_1.bookingModel.findById(id);
    if (!bookingData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid booking data !! ");
    }
    const modifiedData = yield booking_model_1.bookingModel.findByIdAndUpdate(id, { status: booking_constant_1.bookingStatus.approved }, { new: true, runValidators: true });
    return modifiedData;
});
// ! for changing booking status to cancel
const cancelBookingToDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = yield booking_model_1.bookingModel.findById(id);
    if (!bookingData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid booking data !! ");
    }
    //  * check if booking status is completed
    if ((bookingData === null || bookingData === void 0 ? void 0 : bookingData.status) === booking_constant_1.bookingStatus.completed) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking is completed");
    }
    //  * check if booking status is cancel
    if ((bookingData === null || bookingData === void 0 ? void 0 : bookingData.status) === booking_constant_1.bookingStatus.cancel) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking is already canceled");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const carId = bookingData === null || bookingData === void 0 ? void 0 : bookingData.car.toString();
        //  *  for changing car status to availavle
        yield car_model_1.carModel.findByIdAndUpdate(carId, { status: car_constant_1.CarStatus.available }, { new: true, runValidators: true, session });
        const modifiedData = yield booking_model_1.bookingModel.findByIdAndUpdate(id, { status: booking_constant_1.bookingStatus.cancel }, { new: true, runValidators: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return modifiedData;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
});
// ! for finishing booking
const completeBooking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, endTime } = payload;
    const bookingResult = yield booking_model_1.bookingModel.findById(bookingId);
    // * check if booking is exist
    if (!bookingResult) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking not exist");
    }
    //  * check if booking status is completed
    if ((bookingResult === null || bookingResult === void 0 ? void 0 : bookingResult.status) === booking_constant_1.bookingStatus.completed) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking is already completed");
    }
    //  * check if booking status is cancel
    if ((bookingResult === null || bookingResult === void 0 ? void 0 : bookingResult.status) === booking_constant_1.bookingStatus.cancel) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking is already canceled");
    }
    //  * check if booking status is pending
    if ((bookingResult === null || bookingResult === void 0 ? void 0 : bookingResult.status) === booking_constant_1.bookingStatus.pending) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking is not approved!! ");
    }
    const { user: userId, car: carId, startTime } = bookingResult;
    // * check if user is exist
    const user = yield user_model_1.userModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This user don't exist");
    }
    // * check if car is exist
    const car = yield car_model_1.carModel.findById(carId);
    if (!car) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This car don't exist");
    }
    // * check if car is deleted
    if (car.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This car is deleted ");
    }
    const { pricePerHour } = car;
    const startMinutes = (0, car_util_1.convertMinutes)(startTime);
    const endMinutes = (0, car_util_1.convertMinutes)(endTime);
    // * check if end time is greater than start time
    if (startMinutes > endMinutes) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "End time can't be less than start time ");
    }
    //  * check if starttime and endtime is same or not
    if (startMinutes === endMinutes) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "End time can't be equal to start time ");
    }
    const totalCost = ((endMinutes - startMinutes) / 60) * pricePerHour;
    const session = yield mongoose_1.default.startSession();
    // * transaction rollback starts
    try {
        session.startTransaction();
        // * update end time , total cost , booking status
        const result = yield booking_model_1.bookingModel
            .findByIdAndUpdate(bookingId, {
            endTime,
            totalCost,
            status: booking_constant_1.bookingStatus.completed,
        }, { new: true, upsert: true, session })
            .populate({
            path: "user",
            select: " -password -createdAt -updatedAt -__v  ",
        })
            .populate("car");
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
    //
});
// ! for updating  booking data
const updateBookingFromDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = yield booking_model_1.bookingModel.findById(id);
    if (!bookingData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid booking data !! ");
    }
    //  * check if booking status is completed
    if ((bookingData === null || bookingData === void 0 ? void 0 : bookingData.status) === booking_constant_1.bookingStatus.completed) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking is completed");
    }
    //  * check if booking status is cancel
    if ((bookingData === null || bookingData === void 0 ? void 0 : bookingData.status) === booking_constant_1.bookingStatus.cancel) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking is already canceled");
    }
    const result = yield booking_model_1.bookingModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// ! get user booking which are completed
const getUserCompletedBookingFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.bookingModel
        .find({ user: id, status: "completed" })
        .populate({
        path: "user",
        select: " -password -createdAt -updatedAt -__v ",
    })
        .populate("car");
    const successResult = result.filter((item) => (item === null || item === void 0 ? void 0 : item.status) === booking_constant_1.bookingStatus.completed);
    const modifiedResult = successResult.sort((a, b) => {
        const order = {
            pending: 1,
            complete: 2,
        };
        return order[a.payment] - order[b.payment];
    });
    return modifiedResult;
});
// ! get all completed payment data for showing in chart
const getAllCompletedPaymentBookignFromDb = (range) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        let dateRange;
        if (range === "thirty") {
            dateRange = (0, date_fns_1.subDays)(today, 30);
        }
        else if (range === "seven") {
            dateRange = (0, date_fns_1.subDays)(today, 7);
        }
        else {
            dateRange = (0, date_fns_1.subDays)(today, 60);
        }
        const completedBookings = yield booking_model_1.bookingModel
            .find({
            status: { $eq: "completed" },
            payment: { $eq: "complete" },
            updatedAt: { $gte: dateRange },
        })
            .select({
            updatedAt: 1,
            totalCost: 1,
        })
            .sort({ updatedAt: -1 });
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const options = {
                day: "2-digit",
                month: "short",
                year: "numeric",
            };
            return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
        };
        const modifiedData = completedBookings === null || completedBookings === void 0 ? void 0 : completedBookings.map((item) => (Object.assign(Object.assign({}, item.toObject()), { updatedAt: formatDate(item.updatedAt) })));
        const aggregatedData = modifiedData.reduce((acc, item) => {
            const date = item.updatedAt;
            if (!acc[date]) {
                acc[date] = { updatedAt: date, amount: 0 };
            }
            acc[date].amount += item.totalCost;
            return acc;
        }, {});
        const modifiedAggregatedData = Object.values(aggregatedData);
        return modifiedAggregatedData;
    }
    catch (error) {
        throw new Error("Error fetching completed payment bookings: " + error);
    }
});
// ! for calculating total booking revenue of booking that payment is done
const getAllCompletedPaymentBookigRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completedBookings = yield booking_model_1.bookingModel
            .find({
            status: { $eq: "completed" },
            payment: { $eq: "complete" },
        })
            .select(" totalCost ");
        const revenueData = completedBookings.reduce((acc, item) => {
            acc += item === null || item === void 0 ? void 0 : item.totalCost;
            return acc;
        }, 0);
        return revenueData;
    }
    catch (error) {
        throw new Error("Error fetching completed bookings: " + error);
    }
});
//
exports.bookServices = {
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
    getAllCompletedPaymentBookigCount,
    getAllCompletedPaymentBookigRevenue,
    getCompletedBookingUnavailableCar,
};
