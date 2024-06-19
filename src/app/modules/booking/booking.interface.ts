import { Types } from "mongoose";

export interface TBooking {
  date: string;
  user: Types.ObjectId;
  car: Types.ObjectId;
  carId: Types.ObjectId;
  startTime: string;
  endTime: string | null;
  totalCost: number;
}

export interface TReturnCar {
  bookingId: string;
  endTime: string;
}
