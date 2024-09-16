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
exports.verifyPay = exports.initiatePayment = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const initiatePayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield axios_1.default.post(process.env.PAYMENT_URL, {
        tran_id: `${paymentData.transactionId}`,
        store_id: config_1.default.STORE_ID,
        signature_key: config_1.default.SIGNATURE_KEY,
        success_url: `http://localhost:5000/api/payment/confirmation?transactionId=${paymentData.transactionId}`,
        fail_url: `http://localhost:5000/api/payment/cancel-payment`,
        cancel_url: "http://localhost:5173/",
        amount: paymentData.amount,
        currency: "BDT",
        desc: "Merchant Registration Payment",
        cus_name: paymentData.customerName,
        cus_email: paymentData.customerEmail,
        cus_add1: "N/A",
        cus_add2: "N/A",
        cus_city: "N/A",
        cus_state: "N/A",
        cus_postcode: "N/A",
        cus_country: "N/A",
        cus_phone: paymentData.customerPhone,
        type: "json",
    });
    return result.data;
});
exports.initiatePayment = initiatePayment;
// ! for verifying payment
const verifyPay = (trnxID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(config_1.default.PAYMENT_Check_URL, {
            params: {
                request_id: trnxID,
                store_id: config_1.default.STORE_ID,
                signature_key: config_1.default.SIGNATURE_KEY,
                type: "json",
            },
        });
        return result === null || result === void 0 ? void 0 : result.data;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.verifyPay = verifyPay;
