import { z } from "zod";

//   ! validation schema for creating a car
const createCarValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    color: z.string().min(1, { message: "Color is required" }),
    isElectric: z.boolean({ required_error: "isElectric is required" }),
    status: z
      .enum(["available", "unavailable"], {
        required_error: "Status is required",
      })
      .default("available"),
    features: z
      .array(z.string())
      .min(1, { message: "At least one feature is required" }),
    pricePerHour: z
      .number()
      .min(0, { message: "Price per hour must be a positive number" }),
    isDeleted: z.boolean().default(false),
  }),
});

//   ! validation schema for updating  a car
const updateCarValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    isElectric: z.boolean().optional(),
    status: z.enum(["available", "unavailable"]).optional(),
    features: z.array(z.string()).optional(),
    pricePerHour: z.number().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const carValidations = {
  createCarValidationSchema,
  updateCarValidationSchema,
};
