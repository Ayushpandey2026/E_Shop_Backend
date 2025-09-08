import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRouter from "./App/routes/authRoutes.js";
import productRouter from "./App/routes/productRoutes.js";
import cartRouter from "./App/routes/cartRoutes.js";
import orderRouter from "./App/routes/orderRoutes.js";
dotenv.config();

const app = express();

// CORS – allow frontend origin + credentials
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (keep same base for all web routes)
app.use("/api/web/auth", authRouter);
app.use("/api/web/product", productRouter);
app.use("/api/web/cart", cartRouter);
app.use("/api/web/order",orderRouter);
app.get("/", (req, res) => res.send("API up"));

mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Mongo connected");
    app.listen(process.env.PORT || 8000, () =>
      console.log(`Server on :${process.env.PORT || 8000}`)
    );
  })
  .catch((e) => console.error("Mongo error", e));
