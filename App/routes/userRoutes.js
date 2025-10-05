import express from "express";
import {
  getUserAddresses,
  deleteUserAddress,
  getUserPayments,
  deleteUserPayment,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/addresses", verifyToken, getUserAddresses);
userRouter.delete("/address/:id", verifyToken, deleteUserAddress);

userRouter.get("/payments", verifyToken, getUserPayments);
userRouter.delete("/payment/:id", verifyToken, deleteUserPayment);

export default userRouter;
