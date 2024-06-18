"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = void 0;
const zod_1 = require("zod");
const validDate = zod_1.z.string().refine((val) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(val);
}, {
    message: "Invalid date format. Expected format: YYYY-MM-DD",
});
const timeStringSchema = zod_1.z.string().refine((time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
}, {
    message: 'Invalid time format , expected "HH:MM" in 24 hours format',
});
const createBookSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: validDate,
        startTime: timeStringSchema,
    }),
});
exports.bookingValidation = {
    createBookSchema,
};
