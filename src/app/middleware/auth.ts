import httpStatus from "http-status";
import AppError from "../Error/AppError";
import { TUserRole } from "../modules/user/user.interface";
import catchAsync from "../util/catchAsync";
import Jwt, { JwtPayload } from "jsonwebtoken";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // const decoded = Jwt.verify(token, "secret") as JwtPayload;

    // const { role, userId } = decoded;

    // if (requiredRoles && !requiredRoles.includes(role)) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access !!!");
    // }

    // req.user = decoded;
    next();

    //
  });
};

export default auth;
