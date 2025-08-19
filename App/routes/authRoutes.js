import express from "express";
import { forgotPassword, login ,resetPassword } from "../controllers/authController.js";
import { signup } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login",login);
authRouter.post("/signup",signup);

authRouter.post("/forgot-password",forgotPassword)
authRouter.put("/reset-password/:token",resetPassword);
export default authRouter;