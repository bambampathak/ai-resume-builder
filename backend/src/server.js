import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/env.js";

// Local / traditional hosting entry point.
// On Vercel the app is served via the serverless function in api/index.js.
const PORT = config.port;

const server = app.listen(PORT, async () => {
    console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
    await connectDB();
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

export default app;
