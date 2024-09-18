"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
});
// ! validation schema for creating new user
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
        phone: zod_1.z.string().min(1, "Phone number is required"),
    }),
});
// ! validation schema for updating new user
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        role: zod_1.z.enum(["user", "admin"]).optional(),
        password: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
    }),
});
//! reset password
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1, "user id is required"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    }),
});
exports.userValidations = {
    userValidationSchema,
    createUserValidationSchema,
    updateUserValidationSchema,
    resetPasswordValidationSchema,
};
