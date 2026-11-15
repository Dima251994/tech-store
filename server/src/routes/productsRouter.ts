import express from "express";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";

const router = express.Router();

router.get("/api/products", getAllProducts);
router.get("/api/products/:id", getProductById);
router.post("/api/products", createProduct);
router.patch("/api/products/:id", updateProduct);
router.delete("/api/products/:id", deleteProduct);

export default router;
