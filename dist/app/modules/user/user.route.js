"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
// ! for getting all user
// * for admin route
router.get("/all-user", user_controller_1.userControllers.getAllUser);
// ! for getting single user
// * for admin route
router.get("/single-user/:id", user_controller_1.userControllers.getSingleUser);
//
exports.userRoute = router;
