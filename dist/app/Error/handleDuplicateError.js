"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const http_status_1 = __importDefault(require("http-status"));
const handleDuplicateError = (error) => {
    const regex = /\s*"([^"]+)"/;
    const match = error.message.match(regex);
    const extractedMessage = match && match[1];
    const errorMessages = [
        {
            path: "",
            message: `${extractedMessage} is already exist`,
        },
    ];
    const statusCode = http_status_1.default.BAD_REQUEST;
    return {
        statusCode,
        message: error === null || error === void 0 ? void 0 : error.message,
        errorMessages,
    };
};
exports.handleDuplicateError = handleDuplicateError;
