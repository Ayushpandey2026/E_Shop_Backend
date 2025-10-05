import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", createOrder);        // create razorpay order
router.post("/verify", verifyPayment);     // verify & save order

export default router;
