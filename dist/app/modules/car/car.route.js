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
const router = (0, express_1.Router)();
// ! craete car
router.post("/", (0, auth_1.default)(user_constant_1.UserRole.admin), (0, validateRequest_1.default)(car_validation_1.carValidations.createCarValidationSchema), car_controller_1.carController.craeteCar);
// ! get all cars
router.get("/", car_controller_1.carController.getAllCar);
// ! get single car data
router.get("/:id", car_controller_1.carController.getSingleCar);
// ! delete car
router.patch("/:id", car_controller_1.carController.deleteCar);
exports.carRouter = router;
