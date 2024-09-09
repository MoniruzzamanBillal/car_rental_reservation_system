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
// ! get all user from database
const getAllUserFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.find();
    return result;
});
// ! get single user
const getSpecificUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.userModel.isUserExistsById(payload);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist !! ");
    }
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked by admin !!! ");
    }
    return isUserExist;
});
//
exports.userServices = {
    getAllUserFromDb,
    getSpecificUser,
};
