import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

// ! for getting all user
// * for admin route
router.get("/all-user", userControllers.getAllUser);

// ! for getting single user
// * for admin route
router.get("/single-user/:id", userControllers.getSingleUser);

//
export const userRoute = router;
