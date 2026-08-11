import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/env.js";

// Protect routes - verify JWT
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                res.status(401);
                return next(new Error("Not authorized, user not found"));
            }
            next();
        } catch (error) {
            res.status(401);
            return next(new Error("Not authorized, token failed"));
        }
    }

    if (!token) {
        res.status(401);
        return next(new Error("Not authorized, no token"));
    }
};

// Optional auth - attaches user if token present, but doesn't block
export const optionalAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = await User.findById(decoded.id).select("-password");
        } catch (error) {
            // ignore - just no user attached
        }
    }
    next();
};

// Generate JWT
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
};

export default protect;
