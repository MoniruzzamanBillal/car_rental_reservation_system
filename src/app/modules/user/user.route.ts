import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

// ! for getting all user
// * for admin route
router.get("/all-user", userControllers.getAllUser);

//
export const userRoute = router;
