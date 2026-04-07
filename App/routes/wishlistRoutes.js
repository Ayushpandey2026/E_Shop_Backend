import express from "express";
import { getMyWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my", verifyToken, getMyWishlist);
router.delete("/:productId", verifyToken, removeFromWishlist);

export default router;
