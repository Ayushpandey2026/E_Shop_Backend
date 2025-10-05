import razorpay from "../config/razorpay.js";
import crypto from "crypto";






// 1️⃣ Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,  // paise me
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// 2️⃣ Verify Payment & Save Order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, userId } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Save order in DB
      res.status(200).json({ success: true, message: "Payment verified & Order created" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment" });
  }
};
