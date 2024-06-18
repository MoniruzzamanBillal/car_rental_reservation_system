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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const car_model_1 = require("../car/car.model");
const car_constant_1 = require("../car/car.constant");
const booking_model_1 = require("./booking.model");
const Queryuilder_1 = __importDefault(require("../../builder/Queryuilder"));
// ! creating a booking in database
const createBookInDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = payload, requiredData = __rest(payload, ["carId"]);
    // requiredData.endTime = null;
    requiredData.totalCost = 0;
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
        yield car_model_1.carModel.findByIdAndUpdate(payload.car, { status: car_constant_1.CarStatus.unavailable }, { new: true });
        const data = yield booking_model_1.bookingModel.create(requiredData);
        yield session.commitTransaction();
        yield session.endSession();
        return data;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
    return null;
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
        select: "-password -createdAt  -updatedAt -__v ",
    })
        .populate("car");
    return result;
});
//
exports.bookServices = {
    createBookInDb,
    getAllBookingFromDb,
};
