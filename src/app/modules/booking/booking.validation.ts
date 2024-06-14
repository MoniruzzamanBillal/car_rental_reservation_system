import { Types } from "mongoose";
import { z } from "zod";

const validDate = z.string().refine(
  (val) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(val);
  },
  {
    message: "Invalid date format. Expected format: YYYY-MM-DD",
  }
);

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  },
  {
    message: 'Invalid time format , expected "HH:MM" in 24 hours format',
  }
);

const createBookSchema = z.object({
  body: z.object({
    date: validDate,
    startTime: timeStringSchema,
  }),
});

export const bookingValidation = {
  createBookSchema,
};
