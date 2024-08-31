import { Schema, model } from "mongoose";
import { TUSerModel, TUser } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, TUSerModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ! hash password before saving a user in database
userSchema.pre("save", async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user?.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// ! send password empty in response
userSchema.post("save", async function (doc, next) {
  doc.password = "";

  next();
});

// ! statics to check if user exists in database
userSchema.statics.isUserExistsById = async function (id: string) {
  return await userModel.findById(id);
};

//
export const userModel = model<TUser, TUSerModel>("User", userSchema);
