import { Schema, model } from "mongoose";
import { TCar, TCarModel } from "./car.interface";

const carSchema = new Schema<TCar, TCarModel>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  carImg: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },

  isElectric: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available",
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  dropLocation: {
    type: [String],
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  tripCompleted: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

carSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

carSchema.pre("findOne", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// ! check if car data exists in database
carSchema.statics.isCarExist = async function (id: string) {
  return carModel.findById(id);
};

// ! check if user is deleted
carSchema.statics.isCarDeleted = async function (id: string) {
  const data = await carModel.findById(id);
  return data?.isDeleted;
};

//

export const carModel = model<TCar, TCarModel>("Car", carSchema);
