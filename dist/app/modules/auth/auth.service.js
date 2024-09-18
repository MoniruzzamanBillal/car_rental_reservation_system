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
exports.authServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const auth_util_1 = require("./auth.util");
const SendMail_1 = require("../../util/SendMail");
// ! create user in database
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.create(payload);
    return result;
});
// ! sign in
const signInFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User dont exist with this email !!!");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password don't match !!");
    }
    const userId = user === null || user === void 0 ? void 0 : user._id.toHexString();
    const userRole = user === null || user === void 0 ? void 0 : user.role;
    const jwtPayload = {
        userId,
        userRole,
    };
    const token = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_secret, "10d");
    return {
        user,
        token,
    };
    //
});
// ! send mail for reseting password
const resetMailLink = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.userModel
        .findOne({ email })
        .select(" name email role  ");
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User don't exist !!");
    }
    if (findUser === null || findUser === void 0 ? void 0 : findUser.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked !!");
    }
    const userId = findUser === null || findUser === void 0 ? void 0 : findUser._id.toHexString();
    const jwtPayload = {
        userId,
        userRole: findUser === null || findUser === void 0 ? void 0 : findUser.role,
    };
    const token = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_secret, "5m");
    const resetLink = `https://rent-ride-ivory.vercel.app/reset-password/${token}`;
    const sendMailResponse = yield (0, SendMail_1.sendEmail)(resetLink, email);
    return sendMailResponse;
});
// ! for reseting password
const resetPasswordFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, password } = payload;
    // ! check if  user exist
    const user = yield user_model_1.userModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User dont exist !!! ");
    }
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked !!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.userModel.findByIdAndUpdate(userId, {
        password: hashedPassword,
    }, { new: true });
    return null;
});
//
exports.authServices = {
    createUserIntoDB,
    signInFromDb,
    resetMailLink,
    resetPasswordFromDb,
};
