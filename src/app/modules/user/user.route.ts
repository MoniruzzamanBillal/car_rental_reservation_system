import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "./user.constant";

const router = Router();

// ! for getting all user

router.get("/all-user", auth(UserRole.admin), userControllers.getAllUser);

// ! for getting single user
router.get(
  "/single-user/:id",
  auth(UserRole.admin, UserRole.user),
  userControllers.getSingleUser
);

// ! for getting logged in user
router.get(
  "/loggedIn-user",
  auth(UserRole.user),
  userControllers.getLoggedInUser
);

// ! update user
router.patch("/update-user", auth(UserRole.user), userControllers.updateUser);

// ! change user role
router.patch(
  "/change-role/:id",
  auth(UserRole.admin),
  userControllers.changeRole
);

//
export const userRoute = router;
