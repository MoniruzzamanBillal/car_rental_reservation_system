import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.constant";
import { authController } from "./auth.controler";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "../user/user.validation";

const router = Router();

// ! signup new user
router.post(
  "/signup",
  auth(UserRole.user),
  validateRequest(userValidations.createUserValidationSchema),
  authController.createUser
);

export const authRouter = router;
