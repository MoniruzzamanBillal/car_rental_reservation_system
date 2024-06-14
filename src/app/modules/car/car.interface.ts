import { Model } from "mongoose";

export interface TCar {
  name: string;
  description: string;
  color: string;
  isElectric: boolean;
  status: "available" | "unavailable";
  features: string[];
  pricePerHour: number;
  isDeleted: boolean;
}

export interface TCarModel extends Model<TCar> {
  isCarExist(id: string): Promise<TCar>;
  isCarDeleted(id: string): Promise<TCar>;
}
