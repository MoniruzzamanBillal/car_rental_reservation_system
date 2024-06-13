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

export const carRouter = router;
