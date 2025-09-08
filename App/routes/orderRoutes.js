import express from "express";
import {
  createOrders,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

import { verifyToken, admin } from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

// ✅ User Routes
orderRouter.post("/", verifyToken, createOrders); // order create (user must be logged in)
orderRouter.get("/my", verifyToken, getMyOrders); // user ke apne orders
orderRouter.get("/:id", verifyToken, getOrderById); // user apna order ya admin

// ✅ Admin Routes`
orderRouter.get("/", verifyToken, admin, getAllOrders); // all orders (admin only)
orderRouter.put("/:id/status", verifyToken, admin, updateOrderStatus); // update status (admin only)

export default orderRouter;
