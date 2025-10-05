import express from "express";
import { productDelete,productGet,productInsert,productUpdate,productList, seedData } from "../controllers/productController.js";
const productRouter =express.Router();

productRouter.use((req, res, next) => {
  console.log("ProductRouter received request for path:", req.path);
  next();
});

productRouter.get("/seed-products", seedData);
productRouter.get("/",productList);
productRouter.post("/insert",productInsert);
productRouter.delete("/delete/:id",productDelete);
productRouter.put("/update/:id",productUpdate);
productRouter.get("/:id", productGet);
export default productRouter;

