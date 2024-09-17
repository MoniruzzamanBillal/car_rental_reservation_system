import { Router } from "express";
import { authController } from "./auth.controler";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "../user/user.validation";
import { authValidations } from "./auth.validation";

const router = Router();

// ! for reseting password
router.patch(
  "/reset-password",
  validateRequest(userValidations.resetPasswordValidationSchema),
  authController.resetPassWord
);

// ! signup new user
router.post(
  "/signup",
  validateRequest(userValidations.createUserValidationSchema),
  authController.createUser
);

router.post(
  "/signin",
  validateRequest(authValidations.loginValidationSchema),
  authController.signIn
);

// ! for sending reset link to email
router.patch("/reset-link/:email", authController.sendResetLink);

export const authRouter = router;
