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

// ! get user's booking
router.get("/my-bookings", auth(UserRole.user), bookingController.getBooking);

export const bookingRouter = router;
