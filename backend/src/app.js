import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import config from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

// Behind Vercel's proxy — trust it so rate-limit/IP logic works correctly
app.set("trust proxy", 1);

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS — support a comma-separated list of allowed origins so the same code
// works locally and on deployed frontends (Vercel/Netlify, etc.)
const allowedOrigins = (config.clientUrl || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser requests (no Origin header) and any configured origin.
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            // Also allow Vercel preview deployments of the configured frontend.
            if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        },
        credentials: true,
    })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: { message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "AI Resume Builder API is running", timestamp: new Date().toISOString() });
});

// Root route (useful when hitting the deployment base URL directly)
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "AI Resume Builder API. See /api/health" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

export default app;
