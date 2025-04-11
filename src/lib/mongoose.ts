import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) {
    console.log("Using existing connection");

    return;
  }

  const URI = process.env.MONGODB_URI;

  if (!URI) {
    throw new Error("MongoDb URI is not defined !");
  }

  try {
    const db = await mongoose.connect(URI, {
      dbName: "IP_ADDRESS",
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.log("❌ MongoDB Connection Error : ", error);
    isConnected = false;
  }
}
