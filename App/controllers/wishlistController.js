import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// GET /api/wishlist/my
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

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId);
    await wishlist.save();

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
