import { Model } from "mongoose";
import { UserRole } from "./user.constant";

export interface TUser {
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  phone: string;
  address: string;
  isBlocked?: boolean;
}

export interface TUSerModel extends Model<TUser> {
  isUserExistsById(id: string): Promise<TUser>;
}

export type TUserRole = keyof typeof UserRole;
