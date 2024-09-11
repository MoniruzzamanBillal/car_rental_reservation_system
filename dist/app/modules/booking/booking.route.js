"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const booking_validation_1 = require("./booking.validation");
const booking_controller_1 = require("./booking.controller");
const router = (0, express_1.Router)();
// ! create booking
router.post("/", (0, auth_1.default)(user_constant_1.UserRole.user), (0, validateRequest_1.default)(booking_validation_1.bookingValidation.createBookSchema), booking_controller_1.bookingController.createBooking);
//  ! get all booking
router.get("/", (0, auth_1.default)(user_constant_1.UserRole.admin), booking_controller_1.bookingController.getAllBooking);
// ! get user's booking
router.get("/my-bookings", (0, auth_1.default)(user_constant_1.UserRole.user), booking_controller_1.bookingController.getBooking);
// ! approve  booking
router.patch("/approve-booking/:id", (0, auth_1.default)(user_constant_1.UserRole.admin), booking_controller_1.bookingController.approveBooking);
// ! cancel  booking
router.patch("/cancel-booking/:id", (0, auth_1.default)(user_constant_1.UserRole.admin), booking_controller_1.bookingController.cancelBooking);
exports.bookingRouter = router;
