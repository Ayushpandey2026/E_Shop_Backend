import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// POST /api/web/wishlist/add
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const prodId = new mongoose.Types.ObjectId(productId);
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [prodId] });
    } else {
      const alreadyExists = wishlist.products.some(
        (item) => item.toString() === prodId.toString()
      );
      if (!alreadyExists) {
        wishlist.products.push(prodId);
        await wishlist.save();
      }
    }

    await wishlist.populate("products");
    res.status(200).json({ message: "Added to wishlist", wishlist: wishlist.products });
  } catch (err) {
    console.error("Wishlist add error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/web/wishlist/my
export const getMyWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }
    res.json(wishlist.products || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/web/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    const beforeCount = wishlist.products.length;
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);

    if (wishlist.products.length === beforeCount) {
      return res.status(404).json({ message: "Product not in wishlist" });
    }

    await wishlist.save();
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("Wishlist remove error:", err);
    res.status(500).json({ message: err.message });
  }
};
