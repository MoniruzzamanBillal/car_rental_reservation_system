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
exports.userServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const user_model_1 = require("./user.model");
const user_constant_1 = require("./user.constant");
// ! get all user from database
const getAllUserFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.find().select("-password");
    return result;
});
// ! get single user
const getSpecificUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.userModel.findById(payload).select("-password");
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist !! ");
    }
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked by admin !!! ");
    }
    return isUserExist;
});
// ! change user role from data base
const changeUserRoleFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.userModel.findById(userId).select("-password");
    // * check if user exist in data basee
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist !! ");
    }
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked by admin !!! ");
    }
    if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_constant_1.UserRole.admin) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This user is admin , you can't change the role !!! ");
    }
    const reesult = yield user_model_1.userModel.findByIdAndUpdate(userId, { role: user_constant_1.UserRole.admin }, { new: true, runValidators: true });
    return reesult;
});
//
exports.userServices = {
    getAllUserFromDb,
    getSpecificUser,
    changeUserRoleFromDb,
};
