"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carValidations = void 0;
const zod_1 = require("zod");
//   ! validation schema for creating a car
const createCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        description: zod_1.z.string().min(1, { message: "Description is required" }),
        color: zod_1.z.string().min(1, { message: "Color is required" }),
        isElectric: zod_1.z.boolean({ required_error: "isElectric is required" }),
        status: zod_1.z
            .enum(["available", "unavailable"], {
            required_error: "Status is required",
        })
            .default("available"),
        features: zod_1.z
            .array(zod_1.z.string())
            .min(1, { message: "At least one feature is required" }),
        pricePerHour: zod_1.z
            .number()
            .min(0, { message: "Price per hour must be a positive number" }),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
//   ! validation schema for updating  a car
const updateCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        isElectric: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(["available", "unavailable"]).optional(),
        features: zod_1.z.array(zod_1.z.string()).optional(),
        pricePerHour: zod_1.z.number().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
exports.carValidations = {
    createCarValidationSchema,
    updateCarValidationSchema,
};
