"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const auth_controler_1 = require("./auth.controler");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const router = (0, express_1.Router)();
// ! signup new user
router.post("/signup", (0, auth_1.default)(user_constant_1.UserRole.user), (0, validateRequest_1.default)(user_validation_1.userValidations.createUserValidationSchema), auth_controler_1.authController.createUser);
exports.authRouter = router;
