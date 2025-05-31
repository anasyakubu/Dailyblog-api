import mongoose, { Schema } from "mongoose";
import { IApiKey } from "../types/ApiKey";


const apiKeySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    appID: { type: String, ref: 'Application', required: true }, // <--- New
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    usageCount: { type: Number, default: 0 },
    usageLimit: { type: Number, default: 1000 },
    active: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "inactive", "suspended", "deactivated"], default: "active" },
  },
  { timestamps: true }
);

// Create the model
const ApiKey = mongoose.model<IApiKey>("ApiKey", apiKeySchema);

export default ApiKey;