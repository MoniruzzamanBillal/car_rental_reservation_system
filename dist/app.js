"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const MainRoute_1 = require("./app/routes/MainRoute");
const app = (0, express_1.default)();
//  ! middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://rent-ride-ivory.vercel.app"],
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
// ! routes
app.use("/api", MainRoute_1.mainRouter);
app.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ message: "Car reservation server is running  !! " });
    }
    catch (error) {
        next(error);
    }
}));
// ! not found route
app.all("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(404)
        .json({ success: false, statusCode: 404, message: "Not Found" });
}));
//! global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
