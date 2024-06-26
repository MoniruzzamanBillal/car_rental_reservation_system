import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import globalErrorHandler from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import { mainRouter } from "./app/routes/MainRoute";

const app: Application = express();
//  ! middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// ! routes
app.use("/api", mainRouter);

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({ message: "Car reservation server is running  !! " });
  } catch (error) {
    next(error);
  }
});

// ! not found route
app.all("*", async (req: Request, res: Response) => {
  res
    .status(404)
    .json({ success: false, statusCode: 404, message: "Not Found" });
});

//! global error handler
app.use(globalErrorHandler);

export default app;
