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
exports.carServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const car_model_1 = require("./car.model");
const booking_model_1 = require("../booking/booking.model");
const user_model_1 = require("../user/user.model");
const car_util_1 = require("./car.util");
const mongoose_1 = __importDefault(require("mongoose"));
const car_constant_1 = require("./car.constant");
// ! create car in database
const createCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.carModel.create(payload);
    return result;
});
// ! get all car cars from database
const getAllCarDataFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield car_model_1.carModel.find();
});
//  ! get single car data
const getSingleCarFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield car_model_1.carModel.isCarDeleted(id);
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This car is deleted !!");
    }
    const result = yield car_model_1.carModel.findById(id);
    return result;
});
// ! delete car from database ( soft delete )
const deleteCarFromDatabase = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const carData = yield car_model_1.carModel.isCarExist(id);
    if (!carData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Car data don't exist !!!!");
    }
    const isDeleted = yield car_model_1.carModel.isCarDeleted(id);
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This car is already deleted !!");
    }
    const result = yield car_model_1.carModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
// ! return booked car from databbase
const returnBookedCar = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, endTime } = payload;
    const bookingResult = yield booking_model_1.bookingModel.findById(bookingId);
    // ! check if booking is exist
    if (!bookingResult) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking not exist");
    }
    const { user: userId, car: carId, startTime } = bookingResult;
    // ! check if user is exist
    const user = yield user_model_1.userModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This user don't exist");
    }
    // ! check if car is exist
    const car = yield car_model_1.carModel.findById(carId);
    if (!car) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This car don't exist");
    }
    // ! check if car is deleted
    if (car.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This car is deleted ");
    }
    const { pricePerHour } = car;
    const startMinutes = (0, car_util_1.convertMinutes)(startTime);
    const endMinutes = (0, car_util_1.convertMinutes)(endTime);
    // ! check if end time is greater than start time
    if (startMinutes >= endMinutes) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "End time can't be equal to or less than start time ");
    }
    const totalCost = ((endMinutes - startMinutes) / 60) * pricePerHour;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // ! update car status
        yield car_model_1.carModel.findByIdAndUpdate(carId, {
            status: car_constant_1.CarStatus.available,
        }, { new: true, upsert: true, session });
        // ! update end time and total cost
        const result = yield booking_model_1.bookingModel
            .findByIdAndUpdate(bookingId, {
            endTime,
            totalCost,
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
//
exports.carServices = {
    createCarIntoDB,
    getAllCarDataFromDb,
    getSingleCarFromDb,
    deleteCarFromDatabase,
    returnBookedCar,
};
