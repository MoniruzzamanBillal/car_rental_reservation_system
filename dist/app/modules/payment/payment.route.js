"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// ! for payment
router.post("/procede-payment/:id", (0, auth_1.default)(user_constant_1.UserRole.user), payment_controller_1.paymentController.procedePayment);
// ! verifying payment
router.post("/confirmation", payment_controller_1.paymentController.verifyPayment);
// ! cancel payment
router.post("/cancel-payment", payment_controller_1.paymentController.cancelPayment);
exports.paymentRouter = router;
