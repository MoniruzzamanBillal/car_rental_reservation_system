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
exports.paymentController = void 0;
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const sendResponse_1 = __importDefault(require("../../util/sendResponse"));
const booking_model_1 = require("../booking/booking.model");
const car_model_1 = require("../car/car.model");
const payment_service_1 = require("./payment.service");
const redirectURL = "https://rent-ride-ivory.vercel.app";
// const redirectURL = "http://localhost:5173";
// ! for payment
const procedePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentServices.procedePayment(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment procede",
        data: result,
    });
}));
// ! for verify payment
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    const result = yield payment_service_1.paymentServices.verifyPayment(transactionId);
    const bookingData = yield booking_model_1.bookingModel.findOne({ transactionId });
    yield car_model_1.carModel.findByIdAndUpdate(bookingData === null || bookingData === void 0 ? void 0 : bookingData.car, { $inc: { tripCompleted: 1 } }, { new: true, runValidators: true });
    if (result) {
        return res.redirect(`${redirectURL}/payment-success/${bookingData === null || bookingData === void 0 ? void 0 : bookingData._id}`);
    }
    else {
        throw new Error("Payment unsuccessfull");
    }
}));
// ! for cancel payment
const cancelPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.redirect(`${redirectURL}/dashboard/user/user-payment?paymentConfirmation=Failed`);
}));
//
exports.paymentController = {
    procedePayment,
    verifyPayment,
    cancelPayment,
};
