import express from "express";
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
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      // 🆕 New cart create
      cart = new Cart({
        userId: req.user.userId,
        items: [{ productId, quantity: quantity || 1 }],
      });
    } else {
      // 🔄 Agar cart already hai to product check karo
      const itemIndex = cart.items.findIndex(
        (i) => i.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ productId, quantity: quantity || 1 });
      }
    }

    await cart.save();
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

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }

    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");

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
  console.log("🔴 DELETE /cart/remove hit");
  console.log("Body:", req.body);
  console.log("User:", req.user);

  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "ProductId is required" });
  }

  const cart = await Cart.findOne({ userId: req.user.userId });

  if (!cart || !Array.isArray(cart.items)) {
    return res.status(404).json({ success: false, message: "Cart not found or items missing" });
  }

  const originalLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  if (cart.items.length === originalLength) {
    return res.status(404).json({ success: false, message: "Product not found in cart" });
  }

  await cart.save();

  return res.status(200).json({ success: true, message: "Item removed", cart });
});



router.put("/update", verifyToken, async (req, res) => {
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
        message: "Quantity must be at least 1. Use remove instead.",
      });
    }

    const userId = req.user.userId;

    // ✅ Find the cart
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // ✅ Find item index
    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    const product = cart.items[itemIndex].productId;

    // ✅ Check against product quantity
    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} items available in quantity`,
      });
    }

    // ✅ Update quantity
    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    await cart.populate("items.productId");

    // ✅ Optional total amount calculation
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.productId.price,
      0
    );

    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart,
      totalAmount,
    });
  } catch (err) {
    console.error("UPDATE_QUANTITY_ERROR ===>", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});

// routes/cart.js
router.get("/count", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    const count = cart ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;
