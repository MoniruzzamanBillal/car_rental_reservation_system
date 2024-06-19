import httpStatus from "http-status";
import { TerrorMessages, TgenericResponse } from "../interface/error";

export const handleDuplicateError = (error: any): TgenericResponse => {
  const regex = /\s*"([^"]+)"/;
  const match = error.message.match(regex);

  const extractedMessage = match && match[1];

  const errorMessages: TerrorMessages = [
    {
      path: "",
      message: `${extractedMessage} is already exist`,
    },
  ];

  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: error?.message,
    errorMessages,
  };
};
