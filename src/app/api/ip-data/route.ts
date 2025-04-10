import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { IpDataModel } from "@/lib/mongoose-models";
import { revalidatePath } from "next/cache";

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

export async function POST(req: NextRequest) {
  const { ip, country, vpn } = await req.json();

  console.log("Data: ", ip, country, vpn);

  if (!ip || !country || !vpn) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Check if IP already exists
    const existingIp = await IpDataModel.findOne({ ip: ip });

    if (existingIp) {
      // Update existing record
      await IpDataModel.updateOne({ ip: ip }, { country: country, vpn: vpn });
    } else {
      // Create new record
      await IpDataModel.create({
        ip,
        country,
        vpn,
      });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error adding IP data:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
