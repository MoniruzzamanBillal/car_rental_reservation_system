import { Types } from "mongoose";

export interface TBooking {
  date: string;
  status: string;
  dropLocation: string;
  user: Types.ObjectId;
  car: Types.ObjectId;
  carId: Types.ObjectId;
  startTime: string;
  endTime: string | null;
  totalCost: number;
}

export interface TCompleteBooking {
  bookingId: string;
  endTime: string;
}
export interface TReturnCar {
  bookingId: string;
  endTime: string;
}
