import { Types } from "mongoose";

export interface TBooking {
  date: string;
  status: string;
  transactionId: string;
  dropLocation: string;
  additionalFeature?: string[];
  payment: "complete" | "pending";
  paymentMethod: string;
  user: Types.ObjectId;
  car: Types.ObjectId;
  carId: Types.ObjectId;
  startTime: string;
  carStatus: string;
  endTime: string | null;
  totalCost: number;
  license?: number;
  nid?: number;
  _id?: string;
  updatedAt?: Date;
}

export interface TCompleteBooking {
  bookingId: string;
  endTime: string;
}
export interface TReturnCar {
  bookingId: string;
  endTime: string;
}
