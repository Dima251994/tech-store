import express from "express";
import { createOrder } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/api/orders", createOrder);

export default router;
