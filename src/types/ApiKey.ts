import mongoose from "mongoose";


export interface IApiKey extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  key: string;
  appID: string; // Reference to the app
  userID: mongoose.Types.ObjectId;
  usageCount: number;
  usageLimit: number;
  active: boolean;
  status: "active" | "inactive" | "suspended" | "deactivated";
  createdAt?: Date; updatedAt?: Date;
  __v: number;
  lastUsedAt: Date;
}