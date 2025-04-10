"use server";

import dbConnect from "./mongoose";
import { IpDataModel } from "./mongoose-models";
import type { IpData } from "./models/ip-data";
import { revalidatePath } from "next/cache";

export async function addIpData(data: IpData) {
  try {
    await dbConnect();

    // Check if IP already exists
    const existingIp = await IpDataModel.findOne({ ip: data.ip });

    if (existingIp) {
      // Update existing record
      await IpDataModel.updateOne(
        { ip: data.ip },
        { country: data.country, vpn: data.vpn }
      );
    } else {
      // Create new record
      await IpDataModel.create(data);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding IP data:", error);
    throw new Error("Failed to add IP data");
  }
}

export async function getIpData() {
  try {
    await dbConnect();
    const data = await IpDataModel.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching IP data:", error);
    throw new Error("Failed to fetch IP data");
  }
}
