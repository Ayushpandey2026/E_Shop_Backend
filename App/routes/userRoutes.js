import express from "express";
import {
  createUserAddress,
  updateUserAddress,
  getUserAddresses,
  deleteUserAddress,
  getUserPayments,
  createUserPayment,
  deleteUserPayment,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/address", verifyToken, createUserAddress);
userRouter.put("/address/:id", verifyToken, updateUserAddress);
userRouter.get("/addresses", verifyToken, getUserAddresses);
userRouter.delete("/address/:id", verifyToken, deleteUserAddress);

userRouter.post("/payment", verifyToken, createUserPayment);
userRouter.get("/payments", verifyToken, getUserPayments);
userRouter.delete("/payment/:id", verifyToken, deleteUserPayment);

export default userRouter;
