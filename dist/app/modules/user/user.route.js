"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("./user.constant");
const router = (0, express_1.Router)();
// ! for getting all user
router.get("/all-user", (0, auth_1.default)(user_constant_1.UserRole.admin), user_controller_1.userControllers.getAllUser);
// ! for getting single user
router.get("/single-user/:id", (0, auth_1.default)(user_constant_1.UserRole.admin), user_controller_1.userControllers.getSingleUser);
// ! change user role
router.patch("/change-role/:id", (0, auth_1.default)(user_constant_1.UserRole.admin), user_controller_1.userControllers.changeRole);
//
exports.userRoute = router;
