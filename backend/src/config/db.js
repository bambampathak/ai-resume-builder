import mongoose from "mongoose";
import config from "./env.js";

// Cache the connection promise so serverless invocations (Vercel) reuse the
// same connection across warm starts instead of opening a new one each time.
let cachedPromise = null;

const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      console.warn("⚠️  MONGO_URI not set. Database features will be unavailable.");
      return null;
    }

    // Reuse an existing live connection
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    // Reuse an in-flight connection attempt
    if (cachedPromise) {
      return cachedPromise;
    }

    cachedPromise = mongoose
      .connect(config.mongoUri, {
        serverSelectionTimeoutMS: 10000,
        // Keep the pool small — serverless functions are short-lived
        maxPoolSize: 10,
      })
      .then((conn) => {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        // Reset cache so a later invocation can retry
        cachedPromise = null;
        throw error;
      });

    return await cachedPromise;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn("⚠️  Server will continue without DB. Auth/Resume features will fail until MONGO_URI is set.");
    return null;
  }
};

export default connectDB;
