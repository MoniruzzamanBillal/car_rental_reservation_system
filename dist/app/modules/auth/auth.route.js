"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controler_1 = require("./auth.controler");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// ! for sending reset link to email
router.get("/reset-link/:email", auth_controler_1.authController.sendResetLink);
// ! signup new user
router.post("/signup", (0, validateRequest_1.default)(user_validation_1.userValidations.createUserValidationSchema), auth_controler_1.authController.createUser);
router.post("/signin", (0, validateRequest_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controler_1.authController.signIn);
exports.authRouter = router;
