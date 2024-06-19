import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.constant";
import validateRequest from "../../middleware/validateRequest";
import { carValidations } from "./car.validation";
import { carController } from "./car.controller";
import { bookingValidation } from "../booking/booking.validation";

const router = Router();

// ! craete car
router.post(
  "/",
  auth(UserRole.admin),
  validateRequest(carValidations.createCarValidationSchema),
  carController.craeteCar
);

// ! get all cars
router.get("/", carController.getAllCar);

// ! get single car data
router.get("/:id", carController.getSingleCar);

// ! delete car
router.patch("/:id", carController.deleteCar);

// ! return booking car
router.put(
  "/return",
  validateRequest(bookingValidation.returnBookSchema),
  carController.returnBookCar
);

export const carRouter = router;
