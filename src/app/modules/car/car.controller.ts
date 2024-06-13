import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { carServices } from "./car.service";

// ! create car
const craeteCar = catchAsync(async (req, res) => {
  const result = await carServices.createCarIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Car created successfully",
    data: result,
  });
});

//
export const carController = { craeteCar };
