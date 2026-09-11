import app from "../src/app.js";
import connectDB from "../src/config/db.js";

// Vercel serverless entry point.
// Every request routed through vercel.json lands here. We ensure MongoDB is
// connected (cached across warm invocations) before handing off to Express.
export default async function handler(req, res) {
    await connectDB();
    return app(req, res);
}
