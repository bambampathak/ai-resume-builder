import crypto from "crypto";
import User from "../models/User.js";
import { generateToken } from "../middleware/authMiddleware.js";
import config from "../config/env.js";
import { sendEmail } from "../utils/emailService.js";

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            return next(new Error("Please provide name, email, and password"));
        }

        if (password.length < 8) {
            res.status(400);
            return next(new Error("Password must be at least 8 characters long"));
        }

        if (!/[A-Z]/.test(password)) {
            res.status(400);
            return next(new Error("Password must contain at least 1 uppercase letter"));
        }

        if (!/[0-9]/.test(password)) {
            res.status(400);
            return next(new Error("Password must contain at least 1 number"));
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            res.status(400);
            return next(new Error("Password must contain at least 1 special character"));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(409);
            return next(new Error("Email already registered"));
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            return next(new Error("Please provide email and password"));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.status(401);
            return next(new Error("Invalid credentials"));
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(401);
            return next(new Error("Invalid credentials"));
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Google login / signup
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
    try {
        const { name, email, googleId, avatar } = req.body;

        if (!email) {
            res.status(400);
            return next(new Error("Email is required for Google auth"));
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || email.split("@")[0],
                email,
                googleId: googleId || undefined,
                avatar: avatar || "",
            });
        } else if (!user.googleId && googleId) {
            user.googleId = googleId;
            if (avatar) user.avatar = avatar;
            await user.save();
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal that user doesn't exist
            return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

        const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your AI Resume Builder account.</p>
      <p>Click the button below to reset your password. This link expires in 10 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset - AI Resume Builder",
                html: message,
            });
            res.json({ success: true, message: "If that email exists, a reset link has been sent." });
        } catch (err) {
            console.error("❌ Email send error:", err.message);
            console.error("   Full error:", err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(500);
            return next(new Error("Email could not be sent. Please try again later."));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400);
            return next(new Error("Invalid or expired reset token"));
        }

        if (!password || password.length < 6) {
            res.status(400);
            return next(new Error("Password must be at least 6 characters"));
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: "Password reset successful",
            token,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        res.json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user preferences (theme, language)
// @route   PUT /api/auth/preferences
// @access  Private
export const updatePreferences = async (req, res, next) => {
    try {
        const { theme, language } = req.body;
        const user = await User.findById(req.user._id);

        if (theme) user.preferences.theme = theme;
        if (language) user.preferences.language = language;
        await user.save();

        res.json({ success: true, preferences: user.preferences });
    } catch (error) {
        next(error);
    }
};
