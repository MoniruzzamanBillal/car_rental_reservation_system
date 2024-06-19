import httpStatus from "http-status";
import mongoose from "mongoose";
import { TerrorMessages, TgenericResponse } from "../interface/error";

export const handleValidationError = (
  error: mongoose.Error.ValidationError
): TgenericResponse => {
  const errorMessages: TerrorMessages = Object.values(error?.errors).map(
    (value) => {
      return {
        path: value?.path,
        message: value?.message,
      };
    }
  );

  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: "mongoose ValidationError",
    errorMessages,
  };
};
