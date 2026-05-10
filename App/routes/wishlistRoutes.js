import express from "express";
import { addToWishlist, getMyWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToWishlist);
router.get("/my", verifyToken, getMyWishlist);
router.delete("/:productId", verifyToken, removeFromWishlist);

export default router;
