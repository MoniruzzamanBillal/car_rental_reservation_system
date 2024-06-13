import { Schema, model } from "mongoose";
import { TCar, TCarModel } from "./car.interface";

const carSchema = new Schema<TCar, TCarModel>({
  name: {
    type: String,
    required: true,
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
  pricePerHour: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// ! check if car data exists in database
carSchema.statics.isCarExist = async function (id: string) {
  return carModel.findById(id);
};

//

export const carModel = model<TCar, TCarModel>("Car", carSchema);
