import { Router } from "express";
import { authController } from "./auth.controler";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "../user/user.validation";
import { authValidations } from "./auth.validation";

const router = Router();

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

export const authRouter = router;
