import { Router } from "express";

import { authRouter } from "../modules/auth/auth.route";
import { carRouter } from "../modules/car/car.route";
import { bookingRouter } from "../modules/booking/booking.route";

const router = Router();

const allRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/cars",
    route: carRouter,
  },
  {
    path: "/bookings",
    route: bookingRouter,
  },
];

allRoutes.map((route) => {
  router.use(route.path, route.route);
});

export const mainRouter = router;
