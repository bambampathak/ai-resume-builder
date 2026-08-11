import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      console.warn("⚠️  MONGO_URI not set. Database features will be unavailable.");
      return null;
    }
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn("⚠️  Server will continue without DB. Auth/Resume features will fail until MONGO_URI is set.");
    return null;
  }
};

export default connectDB;
