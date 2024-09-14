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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingModel = void 0;
const mongoose_1 = require("mongoose");
const booking_constant_1 = require("./booking.constant");
const bookingSchema = new mongoose_1.Schema({
    date: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    car: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Car",
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        default: null,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    license: {
        type: Number,
    },
    nid: {
        type: Number,
    },
    status: {
        type: String,
        required: true,
        default: booking_constant_1.bookingStatus.pending,
    },
    payment: {
        type: String,
        required: true,
        default: "pending",
    },
    dropLocation: {
        type: String,
        required: true,
    },
    additionalFeature: {
        type: [String],
    },
    paymentMethod: {
        type: String,
        required: true,
    },
}, { timestamps: true });
bookingSchema.pre("find", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.find({ isCanceled: { $ne: true } });
        next();
    });
});
bookingSchema.pre("find", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.find({ status: { $ne: booking_constant_1.bookingStatus.cancel } });
        next();
    });
});
//
exports.bookingModel = (0, mongoose_1.model)("Booking", bookingSchema);
