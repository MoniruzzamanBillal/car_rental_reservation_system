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
exports.carServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const car_model_1 = require("./car.model");
// ! create car in database
const createCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.carModel.create(payload);
    return result;
});
// ! get all car cars from database
const getAllCarDataFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield car_model_1.carModel.find();
});
//  ! get single car data
const getSingleCarFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield car_model_1.carModel.isCarDeleted(id);
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This car is deleted !!");
    }
    const result = yield car_model_1.carModel.findById(id);
    return result;
});
// ! delete car from database ( soft delete )
const deleteCarFromDatabase = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const carData = yield car_model_1.carModel.isCarExist(id);
    if (!carData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Car data don't exist !!!!");
    }
    const isDeleted = yield car_model_1.carModel.isCarDeleted(id);
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This car is already deleted !!");
    }
    const result = yield car_model_1.carModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
//
exports.carServices = {
    createCarIntoDB,
    getAllCarDataFromDb,
    getSingleCarFromDb,
    deleteCarFromDatabase,
};
