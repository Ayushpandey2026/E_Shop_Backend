import express from "express";
import { productDelete,productGet,productInsert,productUpdate,productList, seedData } from "../controllers/productController.js";
const productRouter =express.Router();

// productRouter.get("/seed", seedData);
productRouter.get("/",productList);
productRouter.post("/insert",productInsert);
productRouter.delete("/delete/:id",productDelete);
productRouter.get("/:id", productGet);
productRouter.put("/update/:id",productUpdate);
export default productRouter;

