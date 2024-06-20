import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.constant";
import validateRequest from "../../middleware/validateRequest";
import { carValidations } from "./car.validation";
import { carController } from "./car.controller";

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

// ! return booking car
router.put("/return", auth(UserRole.admin), carController.returnBookCar);

// ! get single car data
router.get("/:id", carController.getSingleCar);

// ! delete car
router.delete("/:id", auth(UserRole.admin), carController.deleteCar);

// ! update car
router.put(
  "/:id",
  auth(UserRole.admin),
  validateRequest(carValidations.updateCarValidationSchema),
  carController.updateCar
);

export const carRouter = router;
