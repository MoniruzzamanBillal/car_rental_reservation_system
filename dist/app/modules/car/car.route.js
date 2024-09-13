"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const car_validation_1 = require("./car.validation");
const car_controller_1 = require("./car.controller");
const SendImageToCloudinary_1 = require("../../util/SendImageToCloudinary");
const router = (0, express_1.Router)();
// ! craete car
router.post("/", (0, auth_1.default)(user_constant_1.UserRole.admin), SendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    const result = JSON.parse(req.body.data);
    req.body = result === null || result === void 0 ? void 0 : result.car;
    next();
}, (0, validateRequest_1.default)(car_validation_1.carValidations.createCarValidationSchema), car_controller_1.carController.craeteCar);
// ! get all cars
router.get("/", car_controller_1.carController.getAllCar);
// ! return booking car
router.put("/return", (0, auth_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.user), car_controller_1.carController.returnBookCar);
// ! get single car data
router.get("/:id", car_controller_1.carController.getSingleCar);
// ! delete car
router.delete("/:id", (0, auth_1.default)(user_constant_1.UserRole.admin), car_controller_1.carController.deleteCar);
// ! update car
router.put("/:id", (0, auth_1.default)(user_constant_1.UserRole.admin), (0, validateRequest_1.default)(car_validation_1.carValidations.updateCarValidationSchema), car_controller_1.carController.updateCar);
// ! return car / change car status
router.patch("/return-car/:id", (0, auth_1.default)(user_constant_1.UserRole.admin), car_controller_1.carController.returnCar);
//
exports.carRouter = router;
