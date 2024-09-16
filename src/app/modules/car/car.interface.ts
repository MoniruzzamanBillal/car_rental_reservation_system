import { Model } from "mongoose";

export interface TCar {
  name: string;
  type: string;
  carImg: string;
  description: string;
  color: string;
  isElectric: boolean;
  status: "available" | "unavailable";
  features: string[];
  dropLocation: string[];
  pricePerHour: number;
  tripCompleted: number;
  isDeleted: boolean;
}

export interface TCarModel extends Model<TCar> {
  isCarExist(id: string): Promise<TCar>;
  isCarDeleted(id: string): Promise<TCar>;
}
