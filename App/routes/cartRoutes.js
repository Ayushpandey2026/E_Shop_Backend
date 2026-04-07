import express from "express";
import mongoose from "mongoose";
import Cart from '../models/Cart.js';
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 👉 Add to Cart
router.post("/add", verifyToken, async (req, res) => {
  try {
    console.log("REQ.USER ===>", req.user);   // 🕵 Debug
    console.log("REQ.BODY ===>", req.body);

    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "ProductId is required" });
    }

    // 🔍 Agar user decode nahi hua
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized h bhai - Invalid token" });
    }

    // ✅ Convert productId to ObjectId
    const prodId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // 🆕 New cart create
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId: prodId, quantity: quantity || 1 }],
      });
    } else {
      // 🔄 Agar cart already hai to product check karo
      const itemIndex = cart.items.findIndex(
        (i) => i.productId.toString() === prodId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ productId: prodId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    // ✅ Populate product details after saving
    await cart.populate('items.productId');
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("ADD_TO_CART_ERROR ===>", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

// 👉 Get User Cart
router.get("/", verifyToken, async (req, res) => {
  try {
    console.log("REQ.USER ===>", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }

    // ✅ Populate product details
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart) {
      return res.status(200).json({ success: true, items: [] });
    }

    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("GET_CART_ERROR ===>", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

// delete 
router.delete("/remove", verifyToken, async (req, res) => {
  try {
    console.log("🔴 DELETE /cart/remove hit");
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "ProductId is required" });
    }

    // ✅ Convert to ObjectId
    const prodId = new mongoose.Types.ObjectId(productId);

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart || !Array.isArray(cart.items)) {
      return res.status(404).json({ success: false, message: "Cart not found or items missing" });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== prodId.toString()
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    await cart.save();
    // ✅ Populate product details after removal
    await cart.populate('items.productId');

    return res.status(200).json({ success: true, message: "Item removed", cart });
  } catch (err) {
    console.error("REMOVE_ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Update cart item quantity (SET operation, not ADD)
router.put("/update-quantity", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({
        success: false,
        message: "ProductId and valid quantity are required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // ✅ Convert to ObjectId
    const prodId = new mongoose.Types.ObjectId(productId);
    const userId = req.user.id;

    // ✅ Find the cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // ✅ Find and update item
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === prodId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    // ✅ SET the quantity (not add)
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.productId');

    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("UPDATE_QUANTITY_ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get cart count
router.get("/count", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    const count = cart ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;
