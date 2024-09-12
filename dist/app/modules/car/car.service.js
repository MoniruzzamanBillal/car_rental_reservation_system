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
exports.carServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const car_model_1 = require("./car.model");
const booking_model_1 = require("../booking/booking.model");
const user_model_1 = require("../user/user.model");
const car_util_1 = require("./car.util");
const mongoose_1 = __importDefault(require("mongoose"));
const car_constant_1 = require("./car.constant");
const Queryuilder_1 = __importDefault(require("../../builder/Queryuilder"));
const booking_constant_1 = require("../booking/booking.constant");
// ! create car in database
const createCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.carModel.create(payload);
    return result;
});
// ! get all car cars from database
const getAllCarDataFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const carQueryBuilder = car_model_1.carModel.find().sort({ status: 1 });
    const carQuery = new Queryuilder_1.default(carQueryBuilder, query).sort();
    const result = yield carQuery.queryModel;
    return result;
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
// ! updating car from database
const updateCarFromDatabase = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { features } = payload, remainingData = __rest(payload, ["features"]);
        const modifiedData = Object.assign({}, remainingData);
        //  * update car feature
        if (features && features.length) {
            yield car_model_1.carModel.findByIdAndUpdate(id, {
                $addToSet: {
                    features: { $each: features },
                },
            }, { new: true, upsert: true, session });
        }
        const result = yield car_model_1.carModel.findByIdAndUpdate(id, modifiedData, {
            new: true,
            upsert: true,
            session,
        });
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
    // * check if booking is exist
    if (!bookingResult) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Booking not exist");
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
        // * update car status
        // await carModel.findByIdAndUpdate(
        //   carId,
        //   {
        //     status: CarStatus.available,
        //   },
        //   { new: true, upsert: true, session }
        // );
        // * update end time and total cost
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
// ! changing car status to available
const changeStatusAvailable = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // * check if car is exist
    const car = yield car_model_1.carModel.findById(id);
    if (!car) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This car don't exist");
    }
    // * check if car is deleted
    if (car.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This car is deleted ");
    }
    // * update car status
    const result = yield car_model_1.carModel.findByIdAndUpdate(id, {
        status: car_constant_1.CarStatus.available,
    }, { new: true, upsert: true });
    return result;
});
//
exports.carServices = {
    createCarIntoDB,
    getAllCarDataFromDb,
    getSingleCarFromDb,
    deleteCarFromDatabase,
    returnBookedCar,
    updateCarFromDatabase,
    changeStatusAvailable,
};
