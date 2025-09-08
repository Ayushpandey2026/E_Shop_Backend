import express from "express";
import { login, signup, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
