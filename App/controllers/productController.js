import productModel from "../models/Product.js";
import axios from 'axios'; 

 const seedData = async () => {
  try {
     const existingCount = await productModel.countDocuments();
    if (existingCount > 0) {
      return res.status(400).send("Products already seeded. Skipping.");
    }

    const response = await axios.get('https://fakestoreapi.com/products');
    await productModel.deleteMany({});
    await productModel.insertMany(response.data);
    console.log("Products seeded successfully");
  }
  catch (error) {
    console.error("Error fetching data from API:", error);
    return;
  }
}

// Insert Product
let productInsert = async (req, res) => {
  try {
    let { title, price, description, category, image, rating } = req.body;

    let product = new productModel({
      title,
      price,
      description,
      category,
      image,
      rating:{
        rate,
        count
      }
    });

    await product.save();
    res.status(200).json({ status: 1, message: "Product inserted successfully" });
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};

// List All Products
let productList = async (req, res) => {
  try {
    let data = await productModel.find();
    if (data.length > 0) {
      return res.json(data);
    } else {
      res.status(404).json({ status: 0, message: "No products found" });
    }
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};

// list one product
let productGetOne = async (req, res) => {
  let proid = req.params.id;
  try {
    let data = await productModel.findById(proid);
    if (data) {
      res.status(200).json({ status: 1, message: "Product fetched successfully", data: data });
    } else {
      res.status(404).json({ status: 0, message: "Product not found" }); 
    }
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};

// Delete Product
let productDelete = async (req, res) => {
  let proid = req.params.id;
  try {
    const result = await productModel.findByIdAndDelete(proid);
    if (result) {
      res.status(200).json({ status: 1, message: "Product deleted successfully" });
    } else {
      res.status(404).json({ status: 0, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};

// Get Product By ID
let productGet = async (req, res) => {
  let proid = req.params.id;
  try {
    let data = await productModel.findById(proid);
    if (data) {
      res.status(200).json({
        status: 1,
        message: "Product fetched successfully",
        data: data,
      });
    } else {
      res.status(404).json({ status: 0, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};

// Update Product
let productUpdate = async (req, res) => {
  const productid = req.params.id;
  const { name, price, description, category, stock, image } = req.body;
  try {
    let data = await productModel.findByIdAndUpdate(
      productid,
      { name, price, description, category, stock, image },
      { new: true }
    );

    if (data) {
      res.status(200).json({
        status: 1,
        message: "Product updated successfully",
        data: data,
      });
    } else {
      res.status(404).json({ status: 0, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ status: 0, message: "Server error", error: error.message });
  }
};

export { productInsert, productList, productDelete, productGet, productUpdate , seedData };
