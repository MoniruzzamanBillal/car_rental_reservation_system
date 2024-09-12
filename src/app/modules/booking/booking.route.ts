import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.constant";
import validateRequest from "../../middleware/validateRequest";
import { bookingValidation } from "./booking.validation";
import { bookingController } from "./booking.controller";

const router = Router();

// ! create booking
router.post(
  "/",
  auth(UserRole.user),
  validateRequest(bookingValidation.createBookSchema),
  bookingController.createBooking
);

//  ! get all booking
router.get("/", auth(UserRole.admin), bookingController.getAllBooking);
//  ! get all completed booking
router.get(
  "/completed-booking",
  auth(UserRole.admin),
  bookingController.getAllCompleteedBooking
);

// ! get user's booking
router.get("/my-bookings", auth(UserRole.user), bookingController.getBooking);

// ! complete booking
router.patch(
  "/complete-booking",
  auth(UserRole.admin, UserRole.user),
  bookingController.compleatingBooking
);

// ! approve  booking
router.patch(
  "/approve-booking/:id",
  auth(UserRole.admin),
  bookingController.approveBooking
);

// ! cancel  booking
router.patch(
  "/cancel-booking/:id",
  auth(UserRole.admin, UserRole.user),
  bookingController.cancelBooking
);

export const bookingRouter = router;
