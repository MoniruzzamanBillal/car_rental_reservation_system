import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.constant";
import { paymentController } from "./payment.controller";

const router = Router();

// ! for payment
router.post(
  "/procede-payment/:id",
  auth(UserRole.user),
  paymentController.procedePayment
);

// ! verifying payment
router.post("/confirmation", paymentController.verifyPayment);
// ! cancel payment
router.post("/cancel-payment", paymentController.cancelPayment);

export const paymentRouter = router;
