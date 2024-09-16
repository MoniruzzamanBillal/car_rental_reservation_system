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
exports.paymentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const booking_model_1 = require("../booking/booking.model");
const booking_constant_1 = require("../booking/booking.constant");
const user_model_1 = require("../user/user.model");
const car_model_1 = require("../car/car.model");
const payment_util_1 = require("./payment.util");
// ! for payament
const procedePayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = yield booking_model_1.bookingModel.findById(id);
    // ! check if booking data exist
    if (!bookingData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid booking data !! ");
    }
    // ! check if booking status is completed
    if ((bookingData === null || bookingData === void 0 ? void 0 : bookingData.status) !== booking_constant_1.bookingStatus.completed) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This booking is not completed !! ");
    }
    // ! check if  user exist
    const checkUser = yield user_model_1.userModel.findById(bookingData === null || bookingData === void 0 ? void 0 : bookingData.user);
    if (!checkUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User dont exist !!! ");
    }
    // ! check if  car exist
    const checkCar = yield car_model_1.carModel.findById(bookingData === null || bookingData === void 0 ? void 0 : bookingData.car);
    if (!checkCar) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "car dont exist !!! ");
    }
    //! check if car is deleted
    const carIsDeleted = checkCar === null || checkCar === void 0 ? void 0 : checkCar.isDeleted;
    if (carIsDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This car is deleted !!! ");
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
    const transactionResult = yield (0, payment_util_1.initiatePayment)(tracsactionData);
    if (transactionResult === null || transactionResult === void 0 ? void 0 : transactionResult.tran_id) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, transactionResult === null || transactionResult === void 0 ? void 0 : transactionResult.tran_id);
    }
    return transactionResult;
});
// ! for verifying payment
const verifyPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResult = yield (0, payment_util_1.verifyPay)(transactionId);
    // console.log(verifyResult);
    // const {pay_status} = verifyResult
    if (verifyResult && (verifyResult === null || verifyResult === void 0 ? void 0 : verifyResult.pay_status) === "Successful") {
        yield booking_model_1.bookingModel.findOneAndUpdate({ transactionId }, {
            payment: "complete",
        }, { new: true });
    }
    return verifyResult;
});
//
exports.paymentServices = {
    procedePayment,
    verifyPayment,
};
