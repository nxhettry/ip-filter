import mongoose from "mongoose";

export default async function dbConnect() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not defined in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
