import mongoose from "mongoose";
import { config } from "./env";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoURI as string);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;