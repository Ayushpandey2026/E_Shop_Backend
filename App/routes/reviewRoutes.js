import express from "express";
import { getReviewsByProduct, createReview } from "../controllers/reviewController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getReviewsByProduct);

// Create a new review
router.post("/", verifyToken, createReview);

export default router;
