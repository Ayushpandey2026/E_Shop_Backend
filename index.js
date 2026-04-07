import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import authRouter from "./App/routes/authRoutes.js";
import productRouter from "./App/routes/productRoutes.js";
import reviewRouter from "./App/routes/reviewRoutes.js";
import cartRouter from "./App/routes/cartRoutes.js";
import orderRouter from "./App/routes/orderRoutes.js";
import adminRouter from "./App/routes/adminRoutes.js";
import analyticsRoute from "./App/routes/analyticsRoute.js";
import userRouter from "./App/routes/userRoutes.js";
import enquiryRouter from "./App/routes/enquiryRoutes.js";



const app = express();


// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

dotenv.config();


app.use(
  cors({
    origin: [
      "https://everbuy.vercel.app",
      "https://e-shop-frontend-1.onrender.com"
    ],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/web/auth", authRouter);
app.use("/api/web/product", productRouter);
app.use("/api/web/cart", cartRouter);
app.use("/api/web/order",orderRouter);
app.use("/api/web/review", reviewRouter);
app.use("/api/web/user", userRouter);
app.use("/api/web/enquiry", enquiryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/analytics", analyticsRoute);

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

