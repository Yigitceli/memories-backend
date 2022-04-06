import { Schema, model } from "mongoose";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
  displayName: { required: true, type: String },
  email: { required: true, type: String },
  password: String,
  authType: { required: true, type: String },
  photoUrl: String,
  userId: String,
});

export const User = model<IUser>("User", userSchema);
