"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carController = void 0;
const NoDataFound_1 = __importDefault(require("../../util/NoDataFound"));
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const sendResponse_1 = __importDefault(require("../../util/sendResponse"));
const car_service_1 = require("./car.service");
// ! create car
const craeteCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.carServices.createCarIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Car created successfully",
        data: result,
    });
}));
// ! get all car
const getAllCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.carServices.getAllCarDataFromDb();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Cars retrieved successfully",
        data: result,
    });
}));
// ! get single car from database
const getSingleCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.carServices.getSingleCarFromDb(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "A Car retrieved successfully",
        data: result,
    });
}));
// ! delete car data
const deleteCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.carServices.deleteCarFromDatabase(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Car Deleted successfully",
        data: result,
    });
}));
//  ! update car
const updateCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.carServices.updateCarFromDatabase(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Car updated  successfully",
        data: result,
    });
}));
// ! return book car
const returnBookCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.carServices.returnBookedCar(req.body);
    if (!result) {
        return (0, NoDataFound_1.default)(res);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Car returned successfully",
        data: result,
    });
}));
//
exports.carController = {
    craeteCar,
    getAllCar,
    getSingleCar,
    deleteCar,
    returnBookCar,
    updateCar,
};
