import { Router } from "express";
import { testRouter } from "../modules/boilerModule/test.route";
import { authRouter } from "../modules/auth/auth.route";
import { carRouter } from "../modules/car/car.route";

const router = Router();

const allRoutes = [
  {
    path: "/test",
    route: testRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/cars",
    route: carRouter,
  },
];

allRoutes.map((route) => {
  router.use(route.path, route.route);
});

export const mainRouter = router;
