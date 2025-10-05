import express from "express";
import { verifyToken, adminOnly } from "../middlewares/authMiddleware.js";
import { getAllOrders, updateOrderStatus, getAllUsers, getAllProducts } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/", verifyToken, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin Panel" });
});

adminRouter.get("/orders", verifyToken, adminOnly, getAllOrders);
adminRouter.put("/orders/:orderId/status", verifyToken, adminOnly, updateOrderStatus);
adminRouter.get("/users", verifyToken, adminOnly, getAllUsers);
adminRouter.get("/products", verifyToken, adminOnly, getAllProducts);

export default adminRouter;
