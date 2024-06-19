import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import catchAsync from "../util/catchAsync";
import Jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../Error/AppError";
import httpStatus from "http-status";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Authorization header missing or malformed"
      );
    }

    const token = header?.split(" ")[1];

    const decoded = Jwt.verify(
      token,
      config.jwt_secret as string
    ) as JwtPayload;

    const { userRole } = decoded;

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "You have no access to this route",
      });
    }

    req.user = decoded;

    next();

    //
  });
};

export default auth;
