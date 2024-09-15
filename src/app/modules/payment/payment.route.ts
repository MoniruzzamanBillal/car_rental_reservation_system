import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.constant";
import { paymentController } from "./payment.controller";

const router = Router();

// ! cancel  booking
router.post(
  "/procede-payment/:id",
  auth(UserRole.user),
  paymentController.procedePayment
);

export const paymentRouter = router;
