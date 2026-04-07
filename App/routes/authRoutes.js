import express from "express";
import { login, signup, forgotPassword, resetPassword, updateProfile } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { singleAvatarUpload } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";
const router = express.Router();

// auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    console.log("req.user in profile route:", req.user);
    const user = await User.findById(req.user.id).select("-password"); // password hata diya
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update profile (with avatar upload)
router.put("/updateProfile", verifyToken, singleAvatarUpload, updateProfile);

export default router;

