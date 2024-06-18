import sendResponse from "./sendResponse";
import { Response } from "express";

const NoDataFound = async (res: Response) => {
  sendResponse(res, {
    statusCode: 404,
    success: false,
    message: "No Data Found",
    data: [],
  });
};

export default NoDataFound;
