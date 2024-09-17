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
//  ! get all completed booking
router.get("/completed-booking", (0, auth_1.default)(user_constant_1.UserRole.admin), booking_controller_1.bookingController.getAllCompleteedBooking);
//  ! get all completed booking
router.get("/completed-payment-booking", (0, auth_1.default)(user_constant_1.UserRole.admin), booking_controller_1.bookingController.getAllPaymentCompletedBooking);
//  ! get all completed booking count
router.get("/completed-payment-booking-count", (0, auth_1.default)(user_constant_1.UserRole.admin), booking_controller_1.bookingController.getAllCompleteedPaymentBookingCount);
//  ! get all completed booking revenue
router.get("/completed-payment-booking-revenue", (0, auth_1.default)(user_constant_1.UserRole.admin), booking_controller_1.bookingController.getAllCompleteedPaymentBookingRevenue);
// ! get user's booking
router.get("/my-bookings", (0, auth_1.default)(user_constant_1.UserRole.user), booking_controller_1.bookingController.getBooking);
// ! get user's completed booking
router.get("/my-completed-bookings", (0, auth_1.default)(user_constant_1.UserRole.user), booking_controller_1.bookingController.getUserCompletedBooking);
// ! get specific  booking
router.get("/single-booking/:id", (0, auth_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.user), booking_controller_1.bookingController.getSpecificBooking);
// ! update booking
router.patch("/update-booking/:id", (0, auth_1.default)(user_constant_1.UserRole.user), booking_controller_1.bookingController.updateBooking);
// ! complete booking
router.patch("/complete-booking", (0, auth_1.default)(user_constant_1.UserRole.user), booking_controller_1.bookingController.compleatingBooking);
// ! approve  booking
router.patch("/approve-booking/:id", (0, auth_1.default)(user_constant_1.UserRole.admin), booking_controller_1.bookingController.approveBooking);
// ! cancel  booking
router.patch("/cancel-booking/:id", (0, auth_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.user), booking_controller_1.bookingController.cancelBooking);
exports.bookingRouter = router;
