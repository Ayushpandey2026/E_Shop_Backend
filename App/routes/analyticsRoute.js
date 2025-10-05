import express from "express";
import Order from "../models/Orders.js";

const router = express.Router();

// 1. Total orders + revenue
router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Revenue by month
router.get("/revenue-by-month", async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Top products
router.get("/top-products", async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          title: "$productDetails.title",
          totalSold: 1
        }
      }
    ]);

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
