import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import globalErrorHandler from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import { mainRouter } from "./app/routes/MainRoute";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// ! routes
app.use("/api", mainRouter);

app.get("/api", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send({ message: "Car reservation server is running  !! " });
  } catch (error) {
    next(error);
  }
});

app.all("*", async (req: Request, res: Response) => {
  res.status(400).json({ success: false, message: "Route not found " });
});

//! global error handler
app.use(globalErrorHandler);

export default app;
