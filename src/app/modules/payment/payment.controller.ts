import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { paymentServices } from "./payment.service";

// ! for payment
const procedePayment = catchAsync(async (req, res) => {
  const result = await paymentServices.procedePayment(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment procede",
    data: result,
  });
});

//

export const paymentController = {
  procedePayment,
};
