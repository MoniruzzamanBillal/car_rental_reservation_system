import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { paymentServices } from "./payment.service";
const redirectURL = "http://localhost:5173";

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

// ! for verify payment
const verifyPayment = catchAsync(async (req, res) => {
  const { transactionId } = req.query;

  const result = await paymentServices.verifyPayment(transactionId as string);

  if (result) {
    return res.redirect(`${redirectURL}/payment-success`);
  } else {
    throw new Error("Payment unsuccessfull");
  }
});

// ! for cancel payment

const cancelPayment = catchAsync(async (req, res) => {
  return res.redirect(
    `${redirectURL}/dashboard/user/user-payment?paymentConfirmation=Failed`
  );
});

//

export const paymentController = {
  procedePayment,
  verifyPayment,
  cancelPayment,
};
