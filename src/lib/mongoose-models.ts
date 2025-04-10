import { Schema, models, model } from "mongoose";
import type { IpData } from "./models/ip-data";

// Define the Mongoose schema
const ipDataSchema = new Schema<IpData>(
  {
    ip: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    vpn: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
export const IpDataModel =
  models.IpData || model<IpData>("IpData", ipDataSchema);
