import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import enquiryRouter from './App/routes/enquiryRoutes.js';
import productRouter from './App/routes/productRoutes.js';
import authRouter from './App/routes/authRoutes.js';

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/web/auth",authRouter);
app.use("/api/web/query",enquiryRouter);
app.use("/api/web/product",productRouter);

mongoose.connect(process.env.DBURL).then(()=>{
    console.log("connected to mongodb");
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
    })
    .catch(err => {
    console.error("Error connecting to MongoDB:", err);
}); 
    

