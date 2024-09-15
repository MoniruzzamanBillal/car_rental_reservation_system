import { Router } from "express";

import { authRouter } from "../modules/auth/auth.route";
import { carRouter } from "../modules/car/car.route";
import { bookingRouter } from "../modules/booking/booking.route";
import { userRoute } from "../modules/user/user.route";
import { paymentRouter } from "../modules/payment/payment.route";

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
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/payment",
    route: paymentRouter,
  },
];

allRoutes.map((route) => {
  router.use(route.path, route.route);
});

export const mainRouter = router;
