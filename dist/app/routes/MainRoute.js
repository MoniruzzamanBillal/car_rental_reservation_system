"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const car_route_1 = require("../modules/car/car.route");
const booking_route_1 = require("../modules/booking/booking.route");
const router = (0, express_1.Router)();
const allRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRouter,
    },
    {
        path: "/cars",
        route: car_route_1.carRouter,
    },
    {
        path: "/bookings",
        route: booking_route_1.bookingRouter,
    },
];
allRoutes.map((route) => {
    router.use(route.path, route.route);
});
exports.mainRouter = router;
