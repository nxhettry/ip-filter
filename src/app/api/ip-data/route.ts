import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { IpDataModel } from "@/lib/mongoose-models";

export async function GET() {
  try {
    await dbConnect();
    const ipData = await IpDataModel.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(ipData);
  } catch (error) {
    console.error("Error fetching IP data:", error);
    return NextResponse.json(
      { error: "Failed to fetch IP data" },
      { status: 500 }
    );
  }
}
