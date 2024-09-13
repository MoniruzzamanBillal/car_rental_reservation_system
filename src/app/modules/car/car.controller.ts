import NoDataFound from "../../util/NoDataFound";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { carServices } from "./car.service";

// ! create car
const craeteCar = catchAsync(async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);

  const result = await carServices.createCarIntoDB(req.body, req.file);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Car created successfully",
    data: result,
  });
});

// ! get all car
const getAllCar = catchAsync(async (req, res) => {
  const result = await carServices.getAllCarDataFromDb(req.query);

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

//  ! update car
const updateCar = catchAsync(async (req, res) => {
  const result = await carServices.updateCarFromDatabase(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated  successfully",
    data: result,
  });
});

// ! return book car
const returnBookCar = catchAsync(async (req, res) => {
  const result = await carServices.returnBookedCar(req.body);

  if (!result) {
    return NoDataFound(res);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car returned successfully",
    data: result,
  });
});

// ! return car / change car status to available
const returnCar = catchAsync(async (req, res) => {
  const result = await carServices.changeStatusAvailable(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car returned successfully",
    data: result,
  });
});

//
export const carController = {
  craeteCar,
  getAllCar,
  getSingleCar,
  deleteCar,
  returnBookCar,
  updateCar,
  returnCar,
};
