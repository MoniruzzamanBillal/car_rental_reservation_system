import mongoose from "mongoose";
import { TerrorMessages, TgenericResponse } from "../interface/error";
import httpStatus from "http-status";

export const handleCastError = (
  error: mongoose.Error.CastError
): TgenericResponse => {
  const errorMessages: TerrorMessages = [
    {
      path: error?.path,
      message: error?.message,
    },
  ];

  const statusCode = httpStatus.NOT_FOUND;

  return {
    statusCode,
    message: "Invalid Id ",
    errorMessages,
  };
};
