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

// ! get all car
const getAllCar = catchAsync(async (req, res) => {
  const result = await carServices.getAllCarDataFromDb();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cars retrieved successfully",
    data: result,
  });
});

// ! get single car from database
const getSingleCar = catchAsync(async (req, res) => {
  const result = await carServices.getSingleCarFromDb(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "A Car retrieved successfully",
    data: result,
  });
});

// ! delete car data
const deleteCar = catchAsync(async (req, res) => {
  const result = await carServices.deleteCarFromDatabase(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car Deleted successfully",
    data: result,
  });
});

//
export const carController = { craeteCar, getAllCar, getSingleCar, deleteCar };
