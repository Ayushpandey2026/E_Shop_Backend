import Review from "../models/Review.js";

// Get reviews by productId
export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.query;
  if (!productId) {
    return res.status(400).json({ status: 0, message: "productId query parameter is required" });
  }
  try {
    const reviews = await Review.find({ productId }).populate("userId", "name");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.userId;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ status: 0, message: "All fields are required" });
  }
  try {
    const review = new Review({ productId, userId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};
