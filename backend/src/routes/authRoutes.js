import express from "express";
import {
  signup,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  getMe,
  updatePreferences,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.put("/preferences", protect, updatePreferences);

export default router;
