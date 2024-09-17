import { z } from "zod";

const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.string().min(1, "Phone number is required"),
});

// ! validation schema for creating new user
const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phone: z.string().min(1, "Phone number is required"),
  }),
});

// ! validation schema for updating new user
const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    role: z.enum(["user", "admin"]).optional(),
    password: z.string().optional(),
    phone: z.string().optional(),
  }),
});

//! reset password
const resetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "user id is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const userValidations = {
  userValidationSchema,
  createUserValidationSchema,
  updateUserValidationSchema,
  resetPasswordValidationSchema,
};
