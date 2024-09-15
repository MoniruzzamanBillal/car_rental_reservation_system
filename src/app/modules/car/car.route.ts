import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.constant";
import validateRequest from "../../middleware/validateRequest";
import { carValidations } from "./car.validation";
import { carController } from "./car.controller";
import { upload } from "../../util/SendImageToCloudinary";

const router = Router();

// ! craete car
router.post(
  "/",
  auth(UserRole.admin),
  upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    const result = JSON.parse(req.body.data);
    req.body = result?.car;

    next();
  },

  validateRequest(carValidations.createCarValidationSchema),
  carController.craeteCar
);

// ! get all cars
router.get("/", carController.getAllCar);

// ! get all available cars
router.get("/available-cars", carController.getAllAvailableCar);

// ! return booking car
router.put(
  "/return",
  auth(UserRole.admin, UserRole.user),
  carController.returnBookCar
);

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

// ! return car / change car status
router.patch("/return-car/:id", auth(UserRole.admin), carController.returnCar);

//

export const carRouter = router;
