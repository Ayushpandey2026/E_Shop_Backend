import express from "express";
import {
  createOrders,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

import { verifyToken, adminOnly} from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

// ✅ User Routes
orderRouter.post("/", verifyToken, createOrders); // order create (user must be logged in)
orderRouter.get("/my", verifyToken, getMyOrders); // user ke apne orders
orderRouter.get("/:id", verifyToken, getOrderById); // user apna order ya adminOnly

// ✅ Admin Routes`
orderRouter.get("/", verifyToken, adminOnly, getAllOrders); // all orders (adminOnly only)
orderRouter.put("/:id/status", verifyToken, adminOnly, updateOrderStatus); // update status (adminOnly only)

export default orderRouter;
