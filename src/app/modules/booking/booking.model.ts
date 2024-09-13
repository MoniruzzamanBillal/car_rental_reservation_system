import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";
import { bookingStatus } from "./booking.constant";

const bookingSchema = new Schema<TBooking>(
  {
    date: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
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
      default: bookingStatus.pending,
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
  },
  { timestamps: true }
);

bookingSchema.pre("find", async function (next) {
  this.find({ isCanceled: { $ne: true } });
  next();
});

bookingSchema.pre("find", async function (next) {
  this.find({ status: { $ne: bookingStatus.cancel } });
  next();
});

//

export const bookingModel = model<TBooking>("Booking", bookingSchema);
